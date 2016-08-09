package configuration;

import javax.validation.constraints.NotNull;

public class TdpRecruitmentEmailConfiguration {
    @NotNull
    private String host;

    @NotNull
    private Integer port;

    @NotNull
    private String from;


    private String password;

    @NotNull
    private String domain;


    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getPassword() {
        return password;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}