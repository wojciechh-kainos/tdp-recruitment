package daoTests;

import databaseHelper.BaseTest;
import domain.Candidate;
import domain.Persons;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static junit.framework.TestCase.assertEquals;

public class CandidateDaoTest extends BaseTest {

    private Candidate exampleCandidate;
    private Persons exampleRecruiter;
    private Long returnedId;

    @Before
    public void setUp(){
        exampleCandidate = new Candidate();
        exampleCandidate.setFirstName("Jan");
        exampleCandidate.setLastName("Kowalski");
        exampleCandidate.setPosition("Trainee Software Engineer");
        exampleCandidate.setDeleted(false);

        getSession().beginTransaction();
        exampleRecruiter = new Persons();
        exampleRecruiter = personsDao.getById(new Long(1));
        getSession().getTransaction().commit();

        exampleCandidate.setRecruiter(exampleRecruiter);
    }

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

    @Test
    public void testDeleteById(){
        getSession().beginTransaction();
        List<Candidate> candidatesFromDbBefore = candidateDao.findAll();
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        returnedId = candidateDao.create(exampleCandidate);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        candidateDao.deleteById(returnedId);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        List<Candidate> candidatesFromDbAfter = candidateDao.findAll();
        getSession().getTransaction().commit();

        assertEquals("In the list from DB should be only one candidate", candidatesFromDbAfter.size(), candidatesFromDbBefore.size());
    }

    @After
    public void tearDown() {
        getSession().beginTransaction();
        candidateDao.delete(returnedId);
        getSession().getTransaction().commit();
    }
}
