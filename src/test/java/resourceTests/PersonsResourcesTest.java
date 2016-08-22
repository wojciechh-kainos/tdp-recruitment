package resourceTests;

import dao.NotesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Notes;
import domain.Persons;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PersonsResource;
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
public class PersonsResourcesTest {

    PersonsResource resource;

    @Mock
    NotesDao mockNotesDao;
    @Mock
    SlotsDao mockSlotsDao;
    @Mock
    PersonsDao mockPersonsDao;
    @Mock
    MailService mockMailService;

    private static List<Notes> stubNoteDB;
    private static Date date;
    private static String dateString;
    private static Persons firstPerson;
    private static Persons secondPerson;
    private static Notes note, note2, note3;

    @BeforeClass
    public static void setUpBeforeClass(){
        java.util.Date date3 = new java.util.Date();
        Calendar c = Calendar.getInstance();
        c.setTime(date3); // Now use today date.
        c.add(Calendar.DATE, 10); // Adding 10 days

        firstPerson = new Persons();
        firstPerson.setEmail("TEST@TEST.PL");
        firstPerson.setId(1L);

        secondPerson = new Persons();
        secondPerson.setEmail("TEST@TEST.PL");
        secondPerson.setId(2L);

        dateString = "26-07-2016";
        date = Date.valueOf("2016-07-26");
        note = new Notes(1L, firstPerson, "note nr 1", date);
        note2 = new Notes(2L, firstPerson, "note nr 2", date);
        note3 = new Notes(2L, firstPerson, "note nr 2", new java.sql.Date(c.getTimeInMillis()));
        stubNoteDB = new ArrayList<>();
        stubNoteDB.add(note);

    }

    @Before
    public void setUp(){
        resource = new PersonsResource(mockPersonsDao, mockSlotsDao, mockMailService, mockNotesDao);
    }

    @Test
    public void testGetNote()throws ParseException{
        when(mockNotesDao.getByPersonIdAndDate(1L,date)).thenReturn(stubNoteDB.get(0));

        Notes result = resource.getNote(1L,dateString);

        assertEquals(stubNoteDB.get(0),result);
        verify(mockNotesDao, times(1)).getByPersonIdAndDate(1L,date);
    }

    @Ignore
    @Test
    public void testCreateNote(){
        when(mockNotesDao.createOrUpdate(note2)).thenReturn(note2);

        Response result = resource.createOrUpdate(note2);

        assertEquals(Response.Status.NOT_ACCEPTABLE.getStatusCode(), result.getStatus());
        verify(mockNotesDao, times(0)).createOrUpdate(note2);
    }

    @Test
    public void testCreateNoteWithCorrectDate(){
        when(mockNotesDao.createOrUpdate(note3)).thenReturn(note3);

        Response result = resource.createOrUpdate(note3);

        assertEquals(Response.Status.ACCEPTED.getStatusCode(), result.getStatus());
    }

    @Test
    public void testCreatePerson(){

        mockPersonsDao.create(firstPerson);

        //  TODO: 18/08/16.

        verify(mockPersonsDao, times(1)).create(firstPerson);

    }

    @Test
    public void testCreatePersonWithEmailInUse(){

        mockPersonsDao.create(firstPerson);

        //TODO: initialize Response r object here because assertEquals is not working inside the catch block.


        try {
            resource.createPerson(secondPerson);
        }
        catch (WebApplicationException e) {
            Response r = e.getResponse();

            assertEquals(Response.Status.CONFLICT, r.getStatusInfo());

        }


        verify(mockPersonsDao, times(1)).create(firstPerson);
        verify(mockPersonsDao, times(1)).create(secondPerson);
        verify(mockPersonsDao, times(1)).findByEmail(secondPerson.getEmail());

    }
}
