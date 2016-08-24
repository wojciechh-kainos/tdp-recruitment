package resourceTests;

import dao.NoteDao;
import dao.PersonDao;
import dao.SlotDao;
import domain.Note;
import domain.Person;
import org.junit.*;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PersonResource;
import services.MailService;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import java.sql.Date;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class PersonResourceTest {

    PersonResource resource;

    @Mock
    NoteDao mockNoteDao;
    @Mock
    SlotDao mockSlotDao;
    @Mock
    PersonDao mockPersonDao;
    @Mock
    MailService mockMailService;

    private static List<Note> stubNoteDB;
    private static Date date;
    private static String dateString;
    private static Person person;
    private static Note note, note2, note3;
    private static Person firstPerson;
    private static Person secondPerson;
    private static List<Person> mockList = new ArrayList<>();

    @BeforeClass
    public static void setUpBeforeClass() {
        java.util.Date date3 = new java.util.Date();
        Calendar c = Calendar.getInstance();
        c.setTime(date3); // Now use today date.
        c.add(Calendar.DATE, 10); // Adding 10 days

        person = new Person();
        person.setId(1L);
        firstPerson = new Person();
        firstPerson.setEmail("TEST@TEST.PL");
        firstPerson.setId(1L);

        mockList.add(firstPerson);

        secondPerson = new Person();
        secondPerson.setEmail("TEST@TEST.PL");
        secondPerson.setId(2L);

        dateString = "2016-07-26";
        date = Date.valueOf(dateString);
        note = new Note(1L, person, "note nr 1", date);
        note2 = new Note(2L, person, "note nr 2", date);
        note3 = new Note(2L, person, "note nr 2", new java.sql.Date(c.getTimeInMillis()));
        stubNoteDB = new ArrayList<>();
        stubNoteDB.add(note);
    }

    @Before
    public void setUp() {
        resource = new PersonResource(mockPersonDao, mockSlotDao, mockMailService, mockNoteDao);
    }

    @Test
    public void testGetNote() throws ParseException {
        when(mockNoteDao.getByPersonIdAndDate(1L, date)).thenReturn(stubNoteDB.get(0));

        Note result = resource.getNote(1L, dateString);

        assertEquals(stubNoteDB.get(0), result);
        verify(mockNoteDao, times(1)).getByPersonIdAndDate(1L, date);
    }

    @Test
    public void testCreateNote() {
        when(mockNoteDao.createOrUpdate(note2)).thenReturn(note2);

        Response result = resource.createOrUpdate(note2);

        assertEquals(Response.Status.ACCEPTED.getStatusCode(), result.getStatus());
        verify(mockNoteDao, times(1)).createOrUpdate(note2);
    }

    @Test
    public void testCreateNoteWithCorrectDate() {
        when(mockNoteDao.createOrUpdate(note3)).thenReturn(note3);

        Response result = resource.createOrUpdate(note3);

        assertEquals(Response.Status.ACCEPTED.getStatusCode(), result.getStatus());
        verify(mockNoteDao, times(1)).createOrUpdate(note3);
    }

    @Test
    public void testCreatePerson() {

        resource.createPerson(firstPerson);

        verify(mockPersonDao, times(1)).create(firstPerson);
    }

    @Test
    public void testCreatePersonWithEmailInUse() {
        when(mockPersonDao.findByEmail(firstPerson.getEmail())).thenReturn(mockList);
        mockPersonDao.create(firstPerson);

        try {
            resource.createPerson(secondPerson);
            fail("WebApplicationException was expected but not thrown.");
        } catch (WebApplicationException e) {

            Response.StatusType r = e.getResponse().getStatusInfo();
            assertEquals(r, Response.Status.CONFLICT);
        }
    }
}
