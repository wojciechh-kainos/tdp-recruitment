package resources;

import com.google.inject.Inject;
import dao.SlotDao;
import domain.Person;
import domain.Slot;
import io.dropwizard.hibernate.UnitOfWork;
import services.PairFinder;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.List;


@Path("/pairs")
@Produces(MediaType.APPLICATION_JSON)
public class PairResource {

    private SlotDao slotDao;

    @Inject
    public PairResource(SlotDao slotDao) {
        this.slotDao = slotDao;
    }

    @GET
    @UnitOfWork
    public List<Person> findPairs(@QueryParam("startDate") String startDate,
                                  @QueryParam("endDate") String endDate,
                                  @QueryParam("isDev") Boolean isDev,
                                  @QueryParam("isTest") Boolean isTest,
                                  @QueryParam("isOps") Boolean isOps) {

        List<Slot> slots = slotDao.findSlotsForPairMatching(startDate, endDate, isDev, isTest, isOps);
        PairFinder pf = new PairFinder();

        return pf.findPairs(slots);
    }
}
