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
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import services.ReportService;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

import static io.dropwizard.testing.FixtureHelpers.fixture;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ReportServiceGetReportTest {

    private static final ObjectMapper MAPPER = Jackson.newObjectMapper();
    private Persons mockPerson;
    private List<Slots> mockSlotsList;
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

        expectedReport = new Report(mockPerson, 0L,0L,0L);
        reportService = new ReportService(slotsDao, personsDao);

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


}
