package resourcesTests;

import dao.NotesDao;
import dao.PersonsDao;
import dao.SlotsDao;
import domain.Notes;
import domain.Persons;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import resources.PersonResources;

import java.sql.Date;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class PersonResourcesTest {

    PersonResources resource;

    @Mock
    NotesDao mockNotesDao;
    @Mock
    SlotsDao mockSlotsDao;
    @Mock
    PersonsDao mockPersonsDao;

    private static List<Notes> stubNoteDB;
    private static Date date;
    private static String dateString;
    private static Persons person;
    private static Notes note, note2;

    @BeforeClass
    public static void setUpBeforeClass(){
        person = new Persons();
        person.setId(1L);
        dateString = "26-07-2016";
        date = Date.valueOf("2016-07-26");
        note = new Notes(1L, person, "note nr 1", date);
        note2 = new Notes(2L, person, "note nr 2", date);
        stubNoteDB = new ArrayList<>();
        stubNoteDB.add(note);
    }

    @Before
    public void setUp(){
        resource = new PersonResources(mockPersonsDao, mockSlotsDao, mockNotesDao);
    }

    @Test
    public void testGetNote()throws ParseException{
        when(mockNotesDao.getByIdAndDate(1L,date)).thenReturn(stubNoteDB.get(0));

        Notes result = resource.getNote(1L,dateString);

        assertEquals(stubNoteDB.get(0),result);
        verify(mockNotesDao, times(1)).getByIdAndDate(1L,date);
    }

    @Test
    public void testCreateNote(){
        when(mockNotesDao.create(note2)).thenReturn(2L);

        Long result = resource.updateNote(note2);

        assertEquals(note2.getId(),result);
        verify(mockNotesDao, times(1)).create(note2);
    }
}
