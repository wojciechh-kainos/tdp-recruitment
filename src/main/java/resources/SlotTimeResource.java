package resources;

import dao.SlotTimeDao;
import domain.SlotTime;
import io.dropwizard.hibernate.UnitOfWork;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/slots_times")
@Produces(MediaType.APPLICATION_JSON)
public class SlotTimeResource {

    private SlotTimeDao slotTimeDao;

    @Inject
    public SlotTimeResource(SlotTimeDao slotTimeDao) {
        this.slotTimeDao = slotTimeDao;
    }

    @GET
    @Path("/all")
    @UnitOfWork
    public List<SlotTime> getAll() {
        return slotTimeDao.getAll();
    }

}
