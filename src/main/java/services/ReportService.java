package services;

import com.google.inject.Inject;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Report;
import domain.Slots;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

/**
 * Created by radoslawl on 16/08/16.
 */
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
        Long wastedCount = 0L;

        Persons person = personsDao.getById(personId);

        List<Slots> slotsList = slotsDao.getForPersonForWeek(personId, startDate, endDate);

        for (Iterator<Slots> i = slotsList.iterator(); i.hasNext(); ){
            Slots slot = i.next();

            if (slot.getType().getType().equals("available")) {
                availableCount +=1;
            } else if(slot.getType().getType().equals("full")) {
                fullCount +=1;
            } else if(slot.getType().getType().equals("init")) {
                initCount +=1;
            }
        }
        wastedCount = availableCount - ( fullCount + initCount );

        return new Report(person, initCount, availableCount, fullCount, wastedCount);
    }

    public List<Report> getAllReports(Date startDate, Date endDate) {
        List<Persons> persList = personsDao.findAll();

        List<Report> reportList = new ArrayList<>();

        for (Iterator<Persons> i = persList.iterator(); i.hasNext(); ) {
            Persons person = i.next();
            reportList.add(getReport(person.getId(), startDate, endDate));
        }

        return reportList;
    }
}
