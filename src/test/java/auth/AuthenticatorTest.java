package auth;

import com.google.common.base.Optional;
import dao.PersonDao;
import domain.Person;
import io.dropwizard.auth.basic.BasicCredentials;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import javax.naming.AuthenticationException;

import static org.mockito.Mockito.when;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class AuthenticatorTest {

  @Mock
  private static PersonDao mockDAO;

  @Mock
  private static TdpRecruitmentPasswordStore mockPasswordStore;

  private static TdpRecruitmentAuthenticator authenticator;

  private static Person stubDbUser;

  @Before
  public void setUp() throws TdpRecruitmentPasswordStore.CannotPerformOperationException {
    stubDbUser = new Person("a@a", "pass");
    authenticator = new TdpRecruitmentAuthenticator(mockDAO, mockPasswordStore);
  }

  @Test
  public void testAuthenticationWithValidLogin() throws AuthenticationException, TdpRecruitmentPasswordStore.InvalidHashException, TdpRecruitmentPasswordStore.CannotPerformOperationException {
    when(mockDAO.getUserByEmail(any())).thenReturn(java.util.Optional.of(stubDbUser));
    when(mockPasswordStore.verifyPassword(anyString(), anyString())).thenReturn(true);

    Optional<Person> result = authenticator.authenticate(new BasicCredentials("", ""));

    assertEquals(result.isPresent(), true);
    assertEquals(result.get(), stubDbUser);
    verify(mockDAO, times(1)).getUserByEmail(any());
  }

  @Test
  public void testAuthenticationWithValidToken() throws AuthenticationException, TdpRecruitmentPasswordStore.InvalidHashException, TdpRecruitmentPasswordStore.CannotPerformOperationException {
    stubDbUser.setToken("token");

    when(mockDAO.getUserByEmail(any())).thenReturn(java.util.Optional.of(stubDbUser));
    when(mockPasswordStore.verifyPassword(anyString(), anyString())).thenReturn(true);

    authenticator.authenticate(new BasicCredentials("a@a", "pass"));

    Optional<Person> result = authenticator.authenticate(new BasicCredentials("a@a", "token"));

    assertEquals(result.isPresent(), true);
    verify(mockDAO, times(2)).getUserByEmail(any());
  }

  @Test
  public void testAuthenticationWithWrongEmail() throws AuthenticationException, TdpRecruitmentPasswordStore.InvalidHashException, TdpRecruitmentPasswordStore.CannotPerformOperationException {
    when(mockDAO.getUserByEmail(any())).thenReturn(java.util.Optional.empty());

    Optional<Person> result = authenticator.authenticate(new BasicCredentials("", ""));

    assertEquals(result.isPresent(), false);

    verify(mockDAO, times(1)).getUserByEmail(any());
    verify(mockPasswordStore, times(0)).verifyPassword(anyString(),anyString());
  }

  @Test
  public void testAuthenticationWithWrongTokenAndPassword() throws AuthenticationException, TdpRecruitmentPasswordStore.InvalidHashException, TdpRecruitmentPasswordStore.CannotPerformOperationException {
    when(mockDAO.getUserByEmail(any())).thenReturn(java.util.Optional.of(stubDbUser));
    when(mockPasswordStore.verifyPassword(anyString(), anyString())).thenReturn(false);

    Optional<Person> result = authenticator.authenticate(new BasicCredentials("", ""));

    assertEquals(result.isPresent(), false);
    verify(mockDAO, times(1)).getUserByEmail(any());
    verify(mockPasswordStore, times(1)).verifyPassword(anyString(),anyString());
  }

  @Test
  public void testAuthenticationWithExpiredToken() throws AuthenticationException, TdpRecruitmentPasswordStore.InvalidHashException, TdpRecruitmentPasswordStore.CannotPerformOperationException {
    stubDbUser.setToken("token");

    when(mockDAO.getUserByEmail(any())).thenReturn(java.util.Optional.of(stubDbUser));

    Optional<Person> result = authenticator.authenticate(new BasicCredentials("", "token"));

    assertEquals(result.isPresent(), false);
    verify(mockDAO, times(1)).getUserByEmail(any());
  }
}
