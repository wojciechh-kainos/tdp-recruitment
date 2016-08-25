package configuration;

import javax.validation.constraints.NotNull;
import java.util.concurrent.TimeUnit;

public class TdpRecruitmentCacheConfiguration {

  @NotNull
  private Integer maximumSize;

  @NotNull
  private Integer expireAfterAccess;

  @NotNull
  private TimeUnit expireAfterAccessTimeUnit;

  public Integer getMaximumSize() {
    return maximumSize;
  }

  public void setMaximumSize(Integer maximumSize) {
    this.maximumSize = maximumSize;
  }

  public Integer getExpireAfterAccess() {
    return expireAfterAccess;
  }

  public void setExpireAfterAccess(Integer expireAfterAccess) {
    this.expireAfterAccess = expireAfterAccess;
  }

  public TimeUnit getExpireAfterAccessTimeUnit() {
    return expireAfterAccessTimeUnit;
  }

  public void setExpireAfterAccessTimeUnit(TimeUnit expireAfterAccessTimeUnit) {
    this.expireAfterAccessTimeUnit = expireAfterAccessTimeUnit;
  }
}
