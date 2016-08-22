package services;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.*;
import java.util.ArrayList;
import java.util.Date;
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

        Double fullCount = 0.0;
        Double initCount = 0.0;

        Persons person = personsDao.getById(personId);

        List<Slots> slotsList = slotsDao.getForPersonForWeek(personId, startDate, endDate);

        for (Slots slot : slotsList) {
            SlotsTimes slotTime = slot.getSlot();

            Double slotDuration = slotTime.getSlotDurationInMinutes();

            switch (slot.getType().getType()) {
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
        return new Report(person, initCount, fullCount);
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
