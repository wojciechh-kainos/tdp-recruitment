package Resources;

/**
 * Created by remigiuszk on 03/08/16.
 */

import dao.SlotsDao;
import domain.Slots;
import io.dropwizard.hibernate.UnitOfWork;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Application;
import javax.ws.rs.core.MediaType;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Path("/slots")
@Produces(MediaType.APPLICATION_JSON)
public class SlotsResource {

    SlotsDao dao;
    @Inject
    SlotsResource(SlotsDao dao){
        this.dao = dao;
    }

    @GET
    @Path("/week")
    @UnitOfWork
    public List<Slots> fetchSlotsForWeek(@QueryParam("id") Long id,
                                  @QueryParam("startDate") String startDate,
                                  @QueryParam("endDate") String endDate) throws ParseException {

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");

        Date start = formatter.parse(startDate);
        Date end = formatter.parse(endDate);

        List<Slots> list = dao.getForPersonForWeek(id,start,end);
        return list;
    }
}
