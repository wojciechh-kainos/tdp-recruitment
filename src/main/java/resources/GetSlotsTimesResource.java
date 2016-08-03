package resources;

import dao.SlotsTimesDao;
import domain.SlotsTimes;
import io.dropwizard.hibernate.UnitOfWork;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/slots_times")
@Produces(MediaType.APPLICATION_JSON)
public class GetSlotsTimesResource {

    private SlotsTimesDao slotsTimesDao;

    @Inject
    public GetSlotsTimesResource(SlotsTimesDao slotsTimesDao) {
        this.slotsTimesDao = slotsTimesDao;
    }

    @GET
    @Path("/all")
    @UnitOfWork
    public List<SlotsTimes> getAll() {
        return slotsTimesDao.getAll();
    }

}
