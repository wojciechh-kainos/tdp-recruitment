package resources;

import auth.TdpRecruitmentAuthenticator;
import com.google.inject.Inject;
import dao.PersonDao;
import domain.Person;
import io.dropwizard.auth.Auth;
import io.dropwizard.auth.AuthenticationException;
import io.dropwizard.auth.basic.BasicCredentials;
import io.dropwizard.hibernate.UnitOfWork;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import com.google.common.base.Optional;


@Path("/auth")
public class AuthResource {

	private TdpRecruitmentAuthenticator authenticator;
	private PersonDao personDao;

	@Inject
	public AuthResource(TdpRecruitmentAuthenticator authenticator, PersonDao personDao) {
		this.authenticator = authenticator;
		this.personDao = personDao;
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
	public Optional<Person> checkIfPersonWithActivationLinkExists (@PathParam("activationLink")String activationLink) {
		return personDao.getUserByActivationLink(activationLink);
	}

	@PUT
	@UnitOfWork
	@Path("/activate/{id}")
	public Response activatePerson (@PathParam("id") Long id) {

		Person person = personDao.getById(id);
		person.setActivationCode(null);

		return Response.status(Response.Status.ACCEPTED).build();
	}

}