var m_repos = [];

function timeDiff(timeRaw) {
    var now = new Date();
    var time = new Date(timeRaw);
    var diff = now - time;

    var days = Math.floor(diff / 1000 / 60 / (60 * 24));

    var date_diff = new Date(diff);
    var sDate = "";
    if (days !== 0) {
        //Count and display nb years
        var years = Math.floor(days / 365);
        if (years !== 0) {
            sDate += years + " an";
            sDate += (years > 1) ? "s " : " ";
            //Reduce it to the number of days not counted
            days = days % 365;
        }

        var months = Math.floor(days / 30);
        if (months !== 0) {
            sDate += months + " mois";
            /*sDate += (months > 1) ? "s " : " ";*/
        } else if (years === 0) {
            sDate += days + "J " + date_diff.getHours() + "H";
        }
    } else {
        sDate += date_diff.getHours() + "H " + date_diff.getMinutes() + "min";
    }
    return sDate;
}

function loadRepos() {
    $('#content').empty();
    var template = $('#repoTemplate').html();
    for (var i = 0; i < m_repos.length; i++) {
        if (!m_repos[i].fork) {
            var elt = {};
            var language = (m_repos[i].language) ? m_repos[i].language : "";

            elt["name"] = m_repos[i].name;
            elt["url"] = m_repos[i].html_url;
            elt["language"] = language;
            elt["description"] = m_repos[i].description;
            elt["date"] = timeDiff(m_repos[i].pushed_at);

            var html = Mustache.to_html(template, elt);
            $('#content').append(html);
        }
    }
}

$(".nav a").on("click", function () {
    $(".nav").find(".active").removeClass("active");
    $(this).parent().addClass("active");
});

$("#orderby a").on("click", function () {
    var selection = $(this).attr('id');
    m_repos = _.sortBy(m_repos, selection);
    if (selection === 'pushed_at') {
        m_repos = m_repos.reverse();
    }
    loadRepos();
});

$.getJSON("https://api.github.com/orgs/fw4spl-org/repos", function (repos) {
    $('#reposLength span').html(_.where(repos, { fork: false }).length);
    var lastCommit = _.sortBy(repos, 'pushed_at').pop();
    $('#lastCommit').html('<a href="https://github.com/' + lastCommit.full_name + '" target="_blank"><span >' + timeDiff(lastCommit.pushed_at) + '</span> since last commit</a>');
    m_repos = _.sortBy(repos, 'pushed_at').reverse();
    loadRepos();
});

$.getJSON("https://api.github.com/orgs/fw4spl-org/members", function (members) {
    $('#membersLength span').html(members.length);
    for (var i = 0; i < members.length; i++) {
        var member = '<a href="' + members[i].html_url + '" title="' + members[i].login + '"><img src="' + members[i].avatar_url + '" height="75"/></a>'
        $('#members').append(member);
    }
});

/*
$.get("https://fw4spl-org.github.io/fw4spl-blog'", function (posts) {
    posts = posts.split('<mark class="cut"></mark>');
    if (posts.length > 1) {
        $('#lastPost').html('<a href="/blog"><span >' + posts[1] + '</span><br>Last post ' + posts[3] + '</a>');
    }
});
*/
