package auth;

import com.google.common.base.Optional;
import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import com.google.inject.Inject;
import dao.PersonDao;
import domain.Person;
import io.dropwizard.auth.Authenticator;
import io.dropwizard.auth.basic.BasicCredentials;
import io.dropwizard.hibernate.UnitOfWork;

import java.util.UUID;
import java.util.concurrent.TimeUnit;


public class TdpRecruitmentAuthenticator implements Authenticator<BasicCredentials, Person> {

	private final PersonDao personDao;

	private final TdpRecruitmentPasswordStore passwordStore;

	private static final Cache<String, Person> cache = CacheBuilder
			.newBuilder()
			.maximumSize(100)
			.expireAfterAccess(10, TimeUnit.MINUTES)
			.build();

	@Inject
	public TdpRecruitmentAuthenticator(PersonDao personDao, TdpRecruitmentPasswordStore passwordStore) {
		this.personDao = personDao;
		this.passwordStore = passwordStore;
	}

	@Override
	@UnitOfWork
	public Optional<Person> authenticate(BasicCredentials credentials) {
		Person user = personDao.getUserByEmail(credentials.getUsername());

		try {
			if (user != null) {
				if (cache.getIfPresent(credentials.getPassword()) != null) {
					return Optional.of(user);
				} else if (passwordStore.verifyPassword(credentials.getPassword(), user.getPassword())) {
					String token = UUID.randomUUID().toString();
					String hashedToken = token;
					user.setToken(hashedToken);
					cache.put(hashedToken, user);
					return Optional.of(user);
				}
			}
		} catch (TdpRecruitmentPasswordStore.CannotPerformOperationException | TdpRecruitmentPasswordStore.InvalidHashException e) {
			e.printStackTrace();
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
