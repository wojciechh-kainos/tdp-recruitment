package daoTests;

import databaseHelper.BaseTest;
import domain.AvailabilityTypes;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

@Ignore
public class AvailabilityTypesDaoTest extends BaseTest{

    @Test
    public void getAvailabilityTypesTest(){
        getSession().beginTransaction();

        AvailabilityTypes anotherAvailabilityTypes = availabilityTypesDao.getById(1);
        assertEquals("First returned availabilityTypes should be type available",
                "available", anotherAvailabilityTypes.getType());

        getSession().getTransaction().commit();
    }

}
