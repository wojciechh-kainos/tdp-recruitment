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

    @Before
    public void setUp(){
        availabilityTypesDao = new AvailabilityTypesDao(sessionFactory);
    }

    @Test
    public void test(){
        getSession().beginTransaction();

        AvailabilityTypes anotherAvailabilityTypes = availabilityTypesDao.getById(1);
        assertEquals("Types of returned availabilityTypes should be equal to added availabilityTypes.",
                "available", anotherAvailabilityTypes.getType());

        getSession().getTransaction().commit();
    }

}
