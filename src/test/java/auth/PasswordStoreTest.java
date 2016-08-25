package auth;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.runners.MockitoJUnitRunner;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertNotEquals;

@RunWith(MockitoJUnitRunner.class)
public class PasswordStoreTest {

  private TdpRecruitmentPasswordStore passwordStore;

  @Before
  public void setUp() {
    passwordStore = new TdpRecruitmentPasswordStore();
  }

  @Test
  public void testHashingWithSalts() throws TdpRecruitmentPasswordStore.CannotPerformOperationException {
    char[] password = "password".toCharArray();

    String hash1 = passwordStore.createHash(password);
    String hash2 = passwordStore.createHash(password);

    // hashing should yield different results for the same password due to using salts
    assertNotEquals(hash1, hash2);
  }

  @Test
  public void testComparingPasswordWithHash() throws TdpRecruitmentPasswordStore.InvalidHashException, TdpRecruitmentPasswordStore.CannotPerformOperationException {
    char[] correctPassword = "correct password".toCharArray();
    char[] badPassword = "bad password".toCharArray();

    String hash = passwordStore.createHash(correctPassword);

    assertTrue(passwordStore.verifyPassword(correctPassword, hash));
    assertFalse(passwordStore.verifyPassword(badPassword, hash));
  }
}
