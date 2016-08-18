package services;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Report;
import domain.Slots;
import domain.SlotsTimes;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

public class ReportService {

    private PersonsDao personsDao;
    private SlotsDao slotsDao;

    @Inject
    public ReportService(SlotsDao slotsDao, PersonsDao personsDao) {
        this.slotsDao = slotsDao;
        this.personsDao = personsDao;
    }

    public Report getReport(long personId, Date startDate, Date endDate) {

        Long availableCount = 0L;
        Long fullCount = 0L;
        Long initCount = 0L;

        Persons person = personsDao.getById(personId);

        List<Slots> slotsList = slotsDao.getForPersonForWeek(personId, startDate, endDate);

        for (Slots slot : slotsList) {
            SlotsTimes slotTime = slot.getSlot();

            Long slotDuration = (slotTime.getEndTime().getTime() - slotTime.getStartTime().getTime())/60000;

            switch (slot.getType().getType()) {
                case "available":
                    availableCount += slotDuration;
                    break;
                case "full":
                    fullCount += slotDuration;
                    break;
                case "init":
                    initCount += slotDuration;
                    break;
            }
        }
        return new Report(person, initCount, availableCount, fullCount);
    }

    public List<Report> getAllReports(Date startDate, Date endDate) {
        List<Persons> personsList = personsDao.findAll();

        List<Report> reportList = new ArrayList<>();

        for (Persons person : personsList) {
            reportList.add(getReport(person.getId(), startDate, endDate));
        }

        return reportList;
    }
}
