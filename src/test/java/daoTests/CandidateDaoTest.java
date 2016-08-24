package daoTests;

import databaseHelper.BaseTest;
import domain.Candidate;
import domain.Person;
import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import java.util.List;

import static junit.framework.TestCase.assertEquals;
import static junit.framework.TestCase.assertTrue;

public class CandidateDaoTest extends BaseTest {

    private Candidate exampleCandidate;
    private Person exampleRecruiter;
    private Long returnedId;

    @Before
    public void setUp(){
        exampleCandidate = new Candidate();
        exampleCandidate.setFirstName("Jan");
        exampleCandidate.setLastName("Kowalski");
        exampleCandidate.setPosition("Trainee Software Engineer");
        exampleCandidate.setIsDeleted(false);

        getSession().beginTransaction();
        exampleRecruiter = new Person();
        exampleRecruiter = personDao.getById(new Long(1));
        getSession().getTransaction().commit();

        exampleCandidate.setRecruiter(exampleRecruiter);
    }

    @Ignore
    @Test
    public void testCreateAndFindAll(){
        getSession().beginTransaction();
        List<Candidate> candidatesFromDbBefore = candidateDao.findAll();
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        returnedId = candidateDao.create(exampleCandidate);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        List<Candidate> candidatesFromDbAfter = candidateDao.findAll();
        getSession().getTransaction().commit();

        assertEquals("In the list from DB should be only one candidate", candidatesFromDbAfter.size()-1, candidatesFromDbBefore.size());
    }

    @Ignore
    @Test
    public void testDeactivateById(){
        getSession().beginTransaction();
        List<Candidate> candidatesFromDbBefore = candidateDao.findAll();
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        returnedId = candidateDao.create(exampleCandidate);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        candidateDao.deactivateById(returnedId);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        List<Candidate> candidatesFromDbAfter = candidateDao.findAll();
        getSession().getTransaction().commit();

        assertEquals("In the list from DB should be only one candidate", candidatesFromDbAfter.size(), candidatesFromDbBefore.size());

        getSession().beginTransaction();
        Candidate deactivatedCandidate = candidateDao.findById(returnedId);
        getSession().getTransaction().commit();

        assertTrue("Deactivated candidate should have is_deleted flag set to true", deactivatedCandidate.getIsDeleted());
    }

    @Ignore
    @Test
    public void testUpdate(){
        getSession().beginTransaction();
        returnedId = candidateDao.create(exampleCandidate);
        getSession().getTransaction().commit();

        String note = "My example note";
        exampleCandidate.setNote(note);
        String position = "Software Engineer";
        exampleCandidate.setPosition(position);

        getSession().beginTransaction();
        candidateDao.update(exampleCandidate);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        Candidate candidateFromDb = candidateDao.findById(returnedId);
        getSession().getTransaction().commit();

        assertEquals("Text of the note should be 'My example note''", note, candidateFromDb.getNote());
        assertEquals("Position of candidate should be 'Software Engineer'", position, candidateFromDb.getPosition());
    }

    @After
    public void tearDown() {
        getSession().beginTransaction();
        candidateDao.deleteById(returnedId);
        getSession().getTransaction().commit();
    }
}
