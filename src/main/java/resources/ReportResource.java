package resources;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Report;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import services.ReportService;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;


@Path("/report")
@Produces(MediaType.APPLICATION_JSON)
public class ReportResource {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;
    private ReportService reportService;

    @Inject
    public ReportResource(SlotsDao slotsDao, PersonsDao personsDao, ReportService reportService) {
        this.slotsDao = slotsDao;
        this.personsDao = personsDao;
        this.reportService = reportService;
    }

    @GET
    @Path("/forId/{date_from}/{date_to}")
    @UnitOfWork
    public Report getReport(
                            @PathParam("date_from") String date_from,
                            @PathParam("date_to") String date_to,
                            @QueryParam("personId") long person_id) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        Date startDate = formatter.parse(date_from);
        Date endDate = formatter.parse(date_to);

        return reportService.getReport(person_id, startDate, endDate);
    }

    @GET
    @Path("/forAll/{date_from}/{date_to}")
    @UnitOfWork
    public List<Report> getAllReports(
                            @PathParam("date_from") String date_from,
                            @PathParam("date_to") String date_to) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        Date startDate = formatter.parse(date_from);
        Date endDate = formatter.parse(date_to);

        return reportService.getAllReports(startDate, endDate);
    }
}
