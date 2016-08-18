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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import static io.dropwizard.testing.FixtureHelpers.fixture;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ReportServiceTest {

    private Date mockStartDate = null;
    private Date mockEndDate = null;

    private List<Persons> mockPersons;
    private Persons mockFirstPerson;
    private Persons mockSecondPerson;

    private List<Slots> mockSlotsList;
    private List<Slots> mockFirstPersonSlotsList;
    private List<Slots> mockSecondPersonSlotsList;

    private static final ObjectMapper MAPPER = Jackson.newObjectMapper();
    private ReportService reportService;

    private Report expectedFirstReport;
    private Report expectedSecondReport;
    private List<Report> expectedReports;

    @Mock
    private static PersonsDao personsDao;

    @Mock
    private static SlotsDao slotsDao;

    @Before
    public void setUp() throws IOException {
        mockPersons = MAPPER.readValue(fixture("fixtures/persons.json"),
                MAPPER.getTypeFactory().constructCollectionType(List.class, Persons.class));
        mockFirstPerson = mockPersons.get(0);
        mockSecondPerson = mockPersons.get(1);
        mockSlotsList = MAPPER.readValue(fixture("fixtures/slots.json"),
                MAPPER.getTypeFactory().constructCollectionType(List.class, Slots.class));

        mockFirstPersonSlotsList = mockSlotsList.stream()
                .filter(slot -> slot.getPerson().getId().equals(mockFirstPerson.getId()))
                    .collect(Collectors.toCollection(ArrayList::new));

        mockSecondPersonSlotsList = mockSlotsList.stream()
                .filter(slot -> slot.getPerson().getId().equals(mockSecondPerson.getId()))
                    .collect(Collectors.toCollection(ArrayList::new));

        expectedFirstReport = new Report(mockFirstPerson, 30L,60L,30L);
        expectedSecondReport = new Report(mockSecondPerson, 0L,60L,60L);
        reportService = new ReportService(slotsDao, personsDao);

        expectedReports = Arrays.asList(expectedFirstReport,expectedSecondReport);
    }

    @Test
    public void getReportTest() {
        when(personsDao.getById(mockFirstPerson.getId())).thenReturn(mockFirstPerson);
        when(slotsDao.getForPersonForWeek(mockFirstPerson.getId(), mockStartDate, mockEndDate)).thenReturn(mockFirstPersonSlotsList);

        Report report = reportService.getReport(mockFirstPerson.getId(), mockStartDate, mockEndDate);

        assertEquals("Report should have expected number of slots", expectedFirstReport, report);
    }

    @Test
    public void getAllReportsTest() {
        when(personsDao.findAll()).thenReturn(mockPersons);
        when(personsDao.getById(mockFirstPerson.getId())).thenReturn(mockFirstPerson);
        when(personsDao.getById(mockSecondPerson.getId())).thenReturn(mockSecondPerson);
        when(slotsDao.getForPersonForWeek(mockFirstPerson.getId(), mockStartDate, mockEndDate)).thenReturn(mockFirstPersonSlotsList);
        when(slotsDao.getForPersonForWeek(mockSecondPerson.getId(), mockStartDate, mockEndDate)).thenReturn(mockSecondPersonSlotsList);

        List<Report> achieved = reportService.getAllReports(mockStartDate, mockEndDate);
        assertEquals(expectedReports, achieved);
    }
}
