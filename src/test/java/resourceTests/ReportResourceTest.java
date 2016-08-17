package resourceTests;

/**
 * Created by radoslawl on 17/08/16.
 */

import domain.Persons;
import domain.Report;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.ReportResource;
import services.ReportService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ReportResourceTest {

    private static final long personId = 1;
    private Persons p;

    private ReportResource reportResource;

    @Mock
    private ReportService reportService;

    @Before
    public void setUp() {
        reportResource = new ReportResource(reportService);

        p = new Persons();
        p.setId(personId);
        p.setFirstName("TEST_NAME");
        p.setEmail("TEST@TEST.PL");
        p.setLastName("TEST_SURNAME");
        p.setBandLevel(2);
    }

    @Test
    public void getReportForPersonId() {
        String inputStartDate = "12-01-2016";
        String inputEndDate = "12-02-2016";

        Date startDate = null;
        Date endDate = null;
        try {
            SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
            startDate = formatter.parse(inputStartDate);
             endDate = formatter.parse(inputEndDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        Long hours = new Long(200);
        Report expected = new Report(p, hours, hours, hours);

        when(reportService.getReport(personId, startDate, endDate)).thenReturn(expected);

        Report achieved = null;
        try {
            achieved = reportResource.getReport(inputStartDate, inputEndDate, personId);
        } catch (ParseException e) {
            e.printStackTrace();
        }

        assertEquals(expected, achieved);
    }
}
