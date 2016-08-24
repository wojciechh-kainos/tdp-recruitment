package auth;

import io.dropwizard.auth.UnauthorizedHandler;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

public class TdpRecruitmentUnauthorizedHandler implements UnauthorizedHandler  {
	@Context
	private HttpServletRequest request;

	@Override
	public Response buildResponse(String prefix, String realm) {
		return Response.status(Response.Status.UNAUTHORIZED).build();
	}

	@Context
	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}
}
