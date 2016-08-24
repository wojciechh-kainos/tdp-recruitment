package services;

import com.google.common.base.Optional;
import com.google.inject.Inject;
import dao.PersonDao;
import dao.SlotDao;
import domain.*;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ReportService {

    private PersonDao personDao;
    private SlotDao slotDao;

    @Inject
    public ReportService(SlotDao slotDao, PersonDao personDao) {
        this.slotDao = slotDao;
        this.personDao = personDao;
    }

    public Report getReport(long personId, Date startDate, Date endDate) throws WebApplicationException{

        Double fullCount = 0.0;
        Double initCount = 0.0;

        Optional<Person> person = personDao.getById(personId);
        if (person.isPresent()) {

            List<Slot> slotList = slotDao.getForPersonForWeek(personId, startDate, endDate);

            for (Slot slot : slotList) {
                SlotTime slotTime = slot.getSlotTime();

            Double slotDuration = slotTime.getSlotDurationInHours();

                switch (slot.getType().getName()) {
                    case full:
                        fullCount += slotDuration;
                        break;
                    case init:
                        initCount += slotDuration;
                        break;
                    default:
                        break;
                }
            }
            return new Report(person.get(), initCount, fullCount);
        }

        throw new WebApplicationException(Response.Status.NOT_FOUND);
    }

    public List<Report> getAllReports(Date startDate, Date endDate) {
        List<Person> personList = personDao.findAllActive();

        List<Report> reportList = new ArrayList<>();

        for (Person person : personList) {
            reportList.add(getReport(person.getId(), startDate, endDate));
        }

        return reportList;
    }
}
