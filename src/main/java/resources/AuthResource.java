package resources;

import auth.TdpRecruitmentAuthenticator;
import com.google.inject.Inject;
import dao.PersonDao;
import domain.Person;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.basic.BasicCredentials;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import com.google.common.base.Optional;
import auth.TdpRecruitmentPasswordStore;


@Path("/auth")
public class AuthResource {

	private TdpRecruitmentAuthenticator authenticator;
	private PersonDao personDao;
	private final TdpRecruitmentPasswordStore passwordStore;

	@Inject
	public AuthResource(TdpRecruitmentAuthenticator authenticator, PersonDao personDao,TdpRecruitmentPasswordStore passwordStore) {
		this.authenticator = authenticator;
		this.personDao = personDao;
		this.passwordStore = passwordStore;
	}

	@POST
	@UnitOfWork
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	public Person login(Person person) throws AuthenticationException {
		Optional<Person> authenticatedUser = authenticator.authenticate(new BasicCredentials(person.getEmail(), person.getPassword()));
		if (authenticatedUser.isPresent()) {
			return authenticatedUser.get();
		} else {
			throw new WebApplicationException(Response.Status.UNAUTHORIZED);
		}
	}

	@GET
	@UnitOfWork
	@Path("activate/{activationLink}")
	public Person checkIfPersonWithActivationLinkExists (@PathParam("activationLink")String activationLink) {
		java.util.Optional<Person> person = personDao.getUserByActivationLink(activationLink);

		return person.orElseThrow(() -> new WebApplicationException(Response.Status.NO_CONTENT));
	}

	@PUT
	@UnitOfWork
	@Path("/activate")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response activatePerson (Person person) {
		java.util.Optional<Person> personToBeActivated = personDao.getById(person.getId());

		if(personToBeActivated.isPresent()) {
			personToBeActivated.get().setActivationCode(null);
			personToBeActivated.get().setActive(true);
			try {
				personToBeActivated.get().setPassword(passwordStore.createHash(person.getPassword()));
			} catch (TdpRecruitmentPasswordStore.CannotPerformOperationException e) {
				e.printStackTrace();
			}
			return Response.status(Response.Status.ACCEPTED).build();
		} else {
		return Response.status(Response.Status.CONFLICT).build();
		}
	}
}