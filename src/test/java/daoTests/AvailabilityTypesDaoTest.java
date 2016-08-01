package daoTests;

import dao.AvailabilityTypesDao;
import databaseHelper.BaseTest;
import domain.AvailabilityTypes;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class AvailabilityTypesDaoTest extends BaseTest{

    private AvailabilityTypesDao availabilityTypesDao;
    private AvailabilityTypes availabilityTypes;


    @Before
    public void setUp(){
        availabilityTypesDao = new AvailabilityTypesDao(sessionFactory);
    }

    @Test
    public void test(){
        getSession().beginTransaction();

        availabilityTypes = new AvailabilityTypes();
        availabilityTypes.setType("Available");
        long returnedId = availabilityTypesDao.create(availabilityTypes);

        AvailabilityTypes anotherAvailabilityTypes = availabilityTypesDao.getById(returnedId);

        assertEquals("ReturnedId should be equal to added availabilityTypes id.", returnedId, anotherAvailabilityTypes.getId());
        assertEquals("Types of returned availabilityTypes should be equal to added availabilityTypes.", "Available", anotherAvailabilityTypes.getType());

        getSession().getTransaction().commit();
    }

    @After
    public void tearDown(){
        getSession().beginTransaction();
        availabilityTypesDao.deleteById(availabilityTypes.getId());
        getSession().getTransaction().commit();
    }
}
