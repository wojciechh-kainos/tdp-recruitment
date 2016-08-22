package servicesTests;

import com.fasterxml.jackson.databind.ObjectMapper;
import dao.PersonDao;
import dao.SlotDao;
import domain.Person;
import domain.Report;
import domain.Slot;
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

    private List<Person> mockPersons;
    private Person mockFirstPerson;
    private Person mockSecondPerson;

    private List<Slot> mockSlotList;
    private List<Slot> mockFirstPersonSlotList;
    private List<Slot> mockSecondPersonSlotList;

    private static final ObjectMapper MAPPER = Jackson.newObjectMapper();
    private ReportService reportService;

    private Report expectedFirstReport;
    private Report expectedSecondReport;
    private List<Report> expectedReports;

    @Mock
    private static PersonDao personsDao;

    @Mock
    private static SlotDao slotsDao;

    @Before
    public void setUp() throws IOException {
        mockPersons = MAPPER.readValue(fixture("fixtures/persons.json"),
                MAPPER.getTypeFactory().constructCollectionType(List.class, Person.class));
        mockFirstPerson = mockPersons.get(0);
        mockSecondPerson = mockPersons.get(1);
        mockSlotList = MAPPER.readValue(fixture("fixtures/slots.json"),
                MAPPER.getTypeFactory().constructCollectionType(List.class, Slot.class));

        mockFirstPersonSlotList = mockSlotList.stream()
                .filter(slot -> slot.getPerson().getId().equals(mockFirstPerson.getId()))
                    .collect(Collectors.toCollection(ArrayList::new));

        mockSecondPersonSlotList = mockSlotList.stream()
                .filter(slot -> slot.getPerson().getId().equals(mockSecondPerson.getId()))
                    .collect(Collectors.toCollection(ArrayList::new));

        expectedFirstReport = new Report(mockFirstPerson, 0.5,1.0,0.5);
        expectedSecondReport = new Report(mockSecondPerson, 0.0,1.0,1.0);
        reportService = new ReportService(slotsDao, personsDao);

        expectedReports = Arrays.asList(expectedFirstReport,expectedSecondReport);
    }

    @Test
    public void getReportTest() {
        when(personsDao.getById(mockFirstPerson.getId())).thenReturn(mockFirstPerson);
        when(slotsDao.getForPersonForWeek(mockFirstPerson.getId(), mockStartDate, mockEndDate)).thenReturn(mockFirstPersonSlotList);

        Report report = reportService.getReport(mockFirstPerson.getId(), mockStartDate, mockEndDate);

        assertEquals("Report should have expected number of slots", expectedFirstReport, report);
    }

    @Test
    public void getAllReportsTest() {
        when(personsDao.findAll()).thenReturn(mockPersons);
        when(personsDao.getById(mockFirstPerson.getId())).thenReturn(mockFirstPerson);
        when(personsDao.getById(mockSecondPerson.getId())).thenReturn(mockSecondPerson);
        when(slotsDao.getForPersonForWeek(mockFirstPerson.getId(), mockStartDate, mockEndDate)).thenReturn(mockFirstPersonSlotList);
        when(slotsDao.getForPersonForWeek(mockSecondPerson.getId(), mockStartDate, mockEndDate)).thenReturn(mockSecondPersonSlotList);

        List<Report> achieved = reportService.getAllReports(mockStartDate, mockEndDate);
        assertEquals(expectedReports, achieved);
    }
}
