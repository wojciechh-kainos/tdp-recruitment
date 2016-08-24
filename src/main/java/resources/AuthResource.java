package resources;

import auth.TdpRecruitmentAuthenticator;
import com.google.inject.Inject;
import domain.Person;
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

	@Inject
	public AuthResource(TdpRecruitmentAuthenticator authenticator) {
		this.authenticator = authenticator;
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
			throw new WebApplicationException(Response.Status.BAD_REQUEST);
		}
	}

	@GET
	@Path("/validateToken")
	public Response validateToken(@QueryParam("token") String token) {
		if(authenticator.isTokenValid(token)) {
			return Response.ok().build();
		} else {
			return Response.status(Response.Status.GONE).build();
		}
	}
}
