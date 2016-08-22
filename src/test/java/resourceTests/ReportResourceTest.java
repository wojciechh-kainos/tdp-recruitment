package resourceTests;

import constants.TdpConstants;
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
    public void getReportForPersonId() throws ParseException {
        String inputStartDate = "12-01-2016";
        String inputEndDate = "12-02-2016";

        SimpleDateFormat formatter = new SimpleDateFormat(TdpConstants.DATE_FORMAT);
        Date startDate = formatter.parse(inputStartDate);
        Date endDate = formatter.parse(inputEndDate);

        Double hours = 200.0;
        Report expected = new Report(p, hours, hours);

        when(reportService.getReport(personId, startDate, endDate)).thenReturn(expected);

        Report achieved = reportResource.getReport(inputStartDate, inputEndDate, personId);

        assertEquals(expected, achieved);
    }
}
