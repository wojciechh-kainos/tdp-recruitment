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
    public void testCreateCandidate(){
        getSession().beginTransaction();
        Long returnedId = candidateDao.create(exampleCandidate);
        getSession().getTransaction().commit();

        getSession().beginTransaction();
        List<Candidate> candidatesFromDb = candidateDao.findAll();
        getSession().getTransaction().commit();

        assertEquals("In the list from DB should be only one candidate", candidatesFromDb.size(), 1);
        assertEquals("Candidate's recruiter id should be equal exampleRecruiter id", candidatesFromDb.get(0).getRecruiter().getId(), exampleRecruiter.getId());
    }

    @After
    public void tearDown() {
        getSession().beginTransaction();
        candidateDao.deleteAll();
        getSession().getTransaction().commit();
    }
}
