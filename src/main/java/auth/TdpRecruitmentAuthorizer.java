package auth;


import domain.Person;
import io.dropwizard.auth.Authorizer;

public class TdpRecruitmentAuthorizer implements Authorizer<Person> {
	@Override
	public boolean authorize(Person principal, String role) {

		if(role.equals("recruiter")) {
			return principal.getAdmin() == true ? true : false;
		} else if(role.equals("interviewer")) {
			return principal.getAdmin() == false ? true : false;
		} else {
			return false;
		}
	}
}
