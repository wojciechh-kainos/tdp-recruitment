package resources;

import com.google.inject.Inject;
import constants.TdpConstants;
import domain.Report;
import io.dropwizard.hibernate.UnitOfWork;
import services.ReportService;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RolesAllowed("recruiter")
@Path("/report")
@Produces(MediaType.APPLICATION_JSON)
public class ReportResource {

    private ReportService reportService;

    @Inject
    public ReportResource(ReportService reportService) {
        this.reportService = reportService;
    }

    @GET
    @Path("/{date_from}/{date_to}/{id}")
    @UnitOfWork
    public Report getReport(
                            @PathParam("date_from") String date_from,
                            @PathParam("date_to") String date_to,
                            @PathParam("id") long person_id) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);

        Date startDate = formatter.parse(date_from);
        Date endDate = formatter.parse(date_to);

        return reportService.getReport(person_id, startDate, endDate);
    }

    @GET
    @Path("/{date_from}/{date_to}")
    @UnitOfWork
    public List<Report> getAllReports(
                            @PathParam("date_from") String date_from,
                            @PathParam("date_to") String date_to) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);

        Date startDate = formatter.parse(date_from);
        Date endDate = formatter.parse(date_to);

        return reportService.getAllReports(startDate, endDate);
    }
}
