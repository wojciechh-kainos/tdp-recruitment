package services;

import com.google.inject.Inject;
import dao.PersonDao;
import dao.SlotDao;
import domain.*;
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

    public Report getReport(long personId, Date startDate, Date endDate) {

        Double availableCount = 0.0;
        Double fullCount = 0.0;
        Double initCount = 0.0;

        Person person = personDao.getById(personId);

        List<Slot> slotList = slotDao.getForPersonForWeek(personId, startDate, endDate);

        for (Slot slot : slotList) {
            SlotTime slotTime = slot.getSlotTime();

            Double slotDuration = slotTime.getSlotDurationInMinutes();

            switch (slot.getType().getName()) {
                case available:
                    availableCount += slotDuration;
                    break;
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
        return new Report(person, initCount, availableCount, fullCount);
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
