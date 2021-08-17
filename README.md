amcatclient
===========

Client code for interfacing with the AmCAT API. 

Installing
----------

You can install amcatclient using pip: 

```{sh}
pip install amcatclient
```

(Note that this requires that you either use sudo or a virtual environment)

You can also copy file [amcatclient.py](amcatclient/amcatclient.py), which you can download or clone using git. 
Since his is licensed with the permissive MIT license, feel free to include this file in your own projects, whether open source or not.

Usage
====

You can include amcatclient to use the AmCAT API from a program.
The client also contains useful scripts for managing AmCAT instances, currently only `copy_articles.py`

Client scripts
----

### Copying aritcles:

You can copy articles from one server to another using the `copy_articles` script.
Note that both servers need to be included in `~/.amcatauth` for this to work. 

```{python}
python -m amcatclient.copy_articles http://preview.amcat.nl http://localhost:8000 1 3 1
```

API
----

```
from amcatclient import AmcatAPI
conn = AmcatAPI("https://vu.amcat.nl", username, password)
```

It is advised to create a `.amcatauth` file in your home directory, which should contain the hostname, username, password for the server(s) you want to use (comma separated, one server per line). In that case, you can omit the authentication info:


```
from amcatclient import AmcatAPI
conn = AmcatAPI("https://vu.amcat.nl")
```

See the [source code](amcatclient.py) for the API methods (sorry!). [demo_wordcount.py](demo_wordcount.py) shows how to use the client to retrieve a set of articles and count the words. [demo_scraper.py](demo_scraper.py) shows a simple scraper that adds all State of the Union speeches to AmCAT. 

