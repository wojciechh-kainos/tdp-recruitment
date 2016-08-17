package servicesTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Persons;
import domain.Report;
import domain.Slots;
import io.dropwizard.jackson.Jackson;
import org.joda.time.LocalDate;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import services.ReportService;

import java.io.IOException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import static io.dropwizard.testing.FixtureHelpers.fixture;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ReportServiceGetReportTest {

    private static final ObjectMapper MAPPER = Jackson.newObjectMapper();
    private Persons mockPerson;
    private List<Persons> mockPersons;
    private List<Slots> mockSlotsList;
    private ReportService reportService;
    private Report expectedReport;

    @Mock
    private static PersonsDao personsDao;

    @Mock
    private static SlotsDao slotsDao;

    @Before
    public void setUp() throws IOException {
        mockPersons = MAPPER.readValue(fixture("fixtures/persons.json"),
                MAPPER.getTypeFactory().constructCollectionType(List.class, Persons.class));
        mockPerson = mockPersons.get(0);
        mockSlotsList = MAPPER.readValue(fixture("fixtures/slots.json"),
                MAPPER.getTypeFactory().constructCollectionType(List.class, Slots.class));

        expectedReport = new Report(mockPerson, 0L,0L,0L);
        reportService = new ReportService(slotsDao, personsDao);

        List<Report> expectedReports = new ArrayList<>();

//        for(Persons p : mockPersons)
//        expectedReports.add(new Report(mockPersons.get(0).));

    }

    @Test
    public void getReportTest() {
        Date startDate = null;
        Date endDate = null;

        when(personsDao.getById(mockPerson.getId())).thenReturn(mockPerson);
        when(slotsDao.getForPersonForWeek(mockPerson.getId(), startDate, endDate)).thenReturn(mockSlotsList);

        Report report = reportService.getReport(mockPerson.getId(), startDate, endDate);
        assertThat(report.equals(expectedReport));
    }

    @Test
    @Ignore
    public void getAllReportsTest() {
        Date startDate = null;
        Date endDate = null;

        when(personsDao.findAll()).thenReturn(mockPersons);
        when(slotsDao.getForPersonForWeek(mockPerson.getId(), startDate, endDate)).thenReturn(mockSlotsList);

        List<Report> achieved = reportService.getAllReports(startDate, endDate);
        assertThat(achieved.equals(expectedReport));
    }


}
