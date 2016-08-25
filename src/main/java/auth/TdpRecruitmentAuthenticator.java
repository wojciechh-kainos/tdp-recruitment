package auth;

import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.inject.Inject;
import configuration.TdpRecruitmentApplicationConfiguration;
import configuration.TdpRecruitmentCacheConfiguration;
import dao.PersonDao;
import domain.Person;
import io.dropwizard.auth.Authenticator;
import io.dropwizard.auth.basic.BasicCredentials;
import io.dropwizard.hibernate.UnitOfWork;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.UUID;
import java.util.concurrent.TimeUnit;


public class TdpRecruitmentAuthenticator implements Authenticator<BasicCredentials, Person> {

	private final PersonDao personDao;
	private static final Logger logger = LoggerFactory.getLogger(TdpRecruitmentAuthenticator.class);

	private final TdpRecruitmentPasswordStore passwordStore;

	private final TdpRecruitmentCacheConfiguration cacheConfiguration;

	private static Cache<String, Person> cache;

	@Inject
	public TdpRecruitmentAuthenticator(PersonDao personDao, TdpRecruitmentPasswordStore passwordStore, TdpRecruitmentCacheConfiguration cacheConfiguration) {
		this.personDao = personDao;
		this.passwordStore = passwordStore;
		this.cacheConfiguration = cacheConfiguration;

		cache = CacheBuilder
			.newBuilder()
			.maximumSize(cacheConfiguration.getMaximumSize())
			.expireAfterAccess(cacheConfiguration.getExpireAfterAccess(), cacheConfiguration.getExpireAfterAccessTimeUnit())
			.build();
	}

	@Override
	@UnitOfWork
	public Optional<Person> authenticate(BasicCredentials credentials) {
		java.util.Optional<Person> user = personDao.getUserByEmail(credentials.getUsername());

		if(!user.isPresent()) {
			logger.warn("Person with username => {} not found", credentials.getUsername());
			return Optional.absent();
		}
		Person person = user.get();

		try {
			if (cache.getIfPresent(credentials.getPassword()) != null) {
				return Optional.of(person);
			} else if (passwordStore.verifyPassword(credentials.getPassword(), person.getPassword())) {
				String token = UUID.randomUUID().toString();
				cache.put(token, person);
				person.setToken(token);
				return Optional.of(person);
			}
		} catch (TdpRecruitmentPasswordStore.CannotPerformOperationException | TdpRecruitmentPasswordStore.InvalidHashException e) {
			logger.warn("Authentication error  => {}", e.getMessage());
		}

		return Optional.absent();
	}

	public boolean isTokenValid(String token) {
		Optional<Person> cachedPerson = Optional.fromNullable(cache.getIfPresent(token));
		if(cachedPerson.isPresent()) {
			return true;
		} else {
			return false;
		}
	}

}
