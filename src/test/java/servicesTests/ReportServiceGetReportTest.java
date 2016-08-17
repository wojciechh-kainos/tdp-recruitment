package servicesTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Report;
import domain.Slots;
import io.dropwizard.jackson.Jackson;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import services.ReportService;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

import static io.dropwizard.testing.FixtureHelpers.fixture;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ReportServiceGetReportTest {

    private Persons mockPerson;
    private List<Slots> mockSlotsList;
    private Date mockStartDate = null;
    private Date mockEndDate = null;

    private static final ObjectMapper MAPPER = Jackson.newObjectMapper();
    private ReportService reportService;
    private Report expectedReport;

    @Mock
    private static PersonsDao personsDao;

    @Mock
    private static SlotsDao slotsDao;

    @Before
    public void setUp() throws IOException {
        mockPerson = MAPPER.readValue(fixture("fixtures/persons.json"), Persons.class);
        mockSlotsList = MAPPER.readValue(fixture("fixtures/slots.json"),
                MAPPER.getTypeFactory().constructCollectionType(List.class, Slots.class));

        expectedReport = new Report(mockPerson, 0L,1L,1L);
        reportService = new ReportService(slotsDao, personsDao);
    }

    @Test
    public void getReportTest() {
        when(personsDao.getById(mockPerson.getId())).thenReturn(mockPerson);
        when(slotsDao.getForPersonForWeek(mockPerson.getId(), mockStartDate, mockEndDate)).thenReturn(mockSlotsList);

        Report report = reportService.getReport(mockPerson.getId(), mockStartDate, mockEndDate);
        assertEquals("Report should have expected number of available slots",
                expectedReport.getNumberOfAvailableSlots(),report.getNumberOfAvailableSlots());
        assertEquals("Report should have expected number of full slots",
                expectedReport.getNumberOfFullSlots(), report.getNumberOfFullSlots());
        assertEquals("Report should have expected number of init slots",
                expectedReport.getNumberOfInitSlots(), report.getNumberOfInitSlots());
    }


}
