---
pubDate: '2025-01-25T23:10:00.000Z'
title: Simple and Efficient Full Text Search using Django and Postgres
description: >-
  Simple and Efficient Full Text Search using Django and Postgres
tags: ['technical']
heroImage: '../../assets/images/te.jpg'
category: 'Tech'
---

_This blog post was done while working on [Worklist](/post/portfolio/worklist)_

I decided to write this short tutorial on how to get set up with Full Text Search in Django since I couldn't find resources on this specific topic that are straightforward as well as efficient(Pythonic).

_Here's an even simpler approach but this can be inefficient: https://docs.djangoproject.com/en/4.2/ref/contrib/postgres/search/#the-search-lookup. Also, ping me if Django 5 comes out, it will make stuff easier and I'll make changes to this article._

I won't go into the details of it since I myself don't fully understand the internals, but I'll link to some of the resources I used. Also note this should also work with Django Rest Framework(DRF) since I've used it with this setup.

_DRF mainly works with the view layer of Django. At the end of the article I gave some extra bits of info along with limitations._

Firstly, let's look at some background, simple search on a database would use the `LIKE` operator and `WHERE` clause. Full text search has the capability to search data from multiple columns efficiently and has the ability to search partial words.

We're going to look at a hypothetical Job Listing Application, and our purpose with this search is to help job seekers look for their desired job.

## Setting up our model: SearchVector Field

Firstly, we need to set up Django's Postgres module in the `settings.py` project file:

```python
INSTALLED_APPS = [
    ...
    'django.contrib.staticfiles',
    'django.contrib.postgres',
    ....
]
```

To do this let's set up the Job model:

```python
# models/job.py
from django.db import models
from django.contrib.postgres.search import SearchVectorField
from ckeditor.fields import RichTextField

class Job(models.Model):
	title = models.CharField(max_length=200)
	description = RichTextField()
	location = models.CharField(max_length=200)
	company_name = models.CharField(max_length=200)
	application_url = models.URLField(blank=True)
	date_added = models.DateTimeField("Date Published", auto_now_add=True, blank=True)
	# This is the all-important search field.
	search = SearchVectorField(null=True)
```

We're placing a `search` field from the `SearchVectorField` that comes from `django.contrib.postgres.search` for our model where we will pre-compute the search vector. The search vector is created from the `to_tsvector` function from Postgres used for full text search. Calculating this takes resources so we'll calculate it only once when inserting/updating(upserting) and **not** for every search.

We're setting null as `True` here, since we can't calculate this field using Python so we'll be asking the database to calculate it for us(will see later).

## Making it more efficient: GIN Index

Then to make it more efficient we'll add a `GinIndex`. We add it to the `Meta` class of our model. We have to tell the `GinIndex` to index the `search` field.

```python
# models/job.py
from django.contrib.postgres.indexes import GinIndex

class Job(models.Model):
  class Meta:
	  # The search index pointing to our actual search field.
	  indexes = [GinIndex(fields=["search"])]
```

## Precomputing the Search Vector

As stated before we can't calculate the `search` field using Python but we can use Django to build the query that can do it for us. Behind the scenes it's building a custom query for us that can be interpreted by the database. Read the comments in this block.

```python
# models/job.py
# Updated the import for search.
# Other imports are omitted.
from django.contrib.postgres.search import SearchVectorField, SearchVector
from django.db import models

class Job(models.Model):
	# We're getting the Manager here so we can use it
	# inside the class.
	jobs = models.Manager()
	class Meta:
		# The search index pointing to our actual search field.
		indexes = [GinIndex(fields=["search"])]

	# Removed the other fields to shorten the block.
	search = SearchVectorField(null=True)

	def save(self, *args, **kwargs):
		super().save(*args, **kwargs)
		# We're updating the search vector using the SearchVector.
		# We can combine fields that we will use to calculate the search vector.
		# We can even assign weights(A,B,C,D)* to denote
		# which field is more important.
		# This can even be one SearchVector such as
		# SearchVector('description')
		Job.jobs.filter(pk=self.id).update(search=(
			SearchVector('title', weight='A')
			+ SearchVector('description', weight='B')
			+ SearchVector('location', weight='C')
			+ SearchVector('company_name', weight='D')
		))
```

Firstly, here we're using `models.Manager()` to get the manager object for our `Job` Model, this is done so we can use it inside the class without errors. Make sure to update any references to this model when you add the `Job Manager`, so everywhere in your code rather than `Job.objects.all()` you have to use `Job.jobs.objects.all()`\*.

Secondly, due to the fact we're pre-calculating the search vector, we'll first save the data normally. Django can also handle updates through the `save` function, so simply we're saying:

1. First save or update the other fields of the `Job` Model.
2. Update the search field for that specific model instance(row) by filtering on that ID.

## Setting up our database migrations: Computing the search field for old data

Last thing we need to do is the compute the search vectors for our existing data when we're migrating(changing) to the new version of the database that includes this search feature. We do this by running code that updates all the rows of our model with the search vector field updated.

After running `python manage.py makemigrations` to create the migration, we should already have code to make the necessary changes. What we want is to pre-compute before adding the `GinIndex`. Read the comments in this block.

```python
# 0007_job_search_job_jobs_job_search_e0srt3_gin.py

import django.contrib.postgres.indexes
from django.contrib.postgres.search import SearchVector, SearchVectorField
from django.db import migrations

# Custom function to compute search vectors
def compute_search_vector(app, schema_editor):
	# To get the model, we need the app
	# in our migration files.
	Jobs = app.get_model("jobs", "Job")
    # Update all objects with the computed search field
	Jobs.objects.update(search=(
		SearchVector('title', weight='A')
		+ SearchVector('description', weight='B')
		+ SearchVector('location', weight='C')
		+ SearchVector('company_name', weight='D')
	))

class Migration(migrations.Migration):
	dependencies = [
		('jobs', '0006_alter_job_date_added'),
	]

	operations = [
		migrations.AddField(
		model_name='job',
		name='search',
		field=SearchVectorField(null=True),
	),
		# We run our python code in our migration files like this
		# the `reverse_code` keyword argument is an anonymous
		# function that returns None.
		migrations.RunPython(compute_search_vector
        , reverse_code=lambda a, b: None)
	,
	migrations.AddIndex(
		model_name='job',
		index=django.contrib.postgres.indexes.GinIndex(fields=['search'], name='jobs_job_search_e0srt3_gin'),
		),
	]
```

Now we run `python manage.py migrate`.

### Querying the data from our backend

Now we're all setup. As we can see all of the setup is in the Data layer of our application. We can now do as we like to filter on the search field, but the _BIG DISCLAIMER_ is that you'll need a very specific query for this to work.

```sql
SELECT field1,field2 FROM tableName
WHERE to_tsvector(coalesce(field1, ''), coalesce(field1, '')), coalesce) @@ to_tsquery('search query')
```

This is the structure of the raw query that gets executed but we already pre-calculated the search vector so our query should look like:

```sql
SELECT field1,field2 FROM tableName
WHERE search @@ to_tsquery('search query')
```

Now, it's up to you how it can implemented in your own framework. However, since Django has _built-in_ support for Full text search we can simply do this in DRF in the `get_queryset` method of any our ViewSets:

```python
def get_queryset(self):
	if self.request.query_params.get('search'):
		search = self.request.query_params.get('search')
		return Job.jobs.filter(search=search)
	else:
		return Job.jobs.all()
```

With plain Django you can also do a similar filter and behind the scenes it will be interpreted as a vector search since we're using the `SearchVector` field. We can do much more if we use the `SearchQuery` class to modify our queries and that's described pretty well in the Django docs. Using only `Job.jobs.filter(search=search)` gives us a query similar to this:

```sql
SELECT * FROM "jobs_job"
WHERE "jobs_job"."search" @@ (plainto_tsquery(`search`))
```

That's it for a simple full text search setup with Django. Feel free to find me at https://twitter.com/aryantwitting for questions or corrections to this article. Hope this helps you get started on your project.

Django let's you do more things such as SearchRank, SearchHeadline and TrigramSimilarity\*. You can use the same principles of pre-computing your search vectors and using GinIndexes to make your setup more efficient.

_Limitation_

1. This search will need queries that resemble words, so it won't work for 2-3 letter characters. I'll be posting another article after I figure out how to fix this.

_Extra explanation_

1. I'm not sure of a way to reference the model class without using the Manager class inside the Model class. Please let me know if you find one.
2. I couldn't find a simple way to insert and update the search field using only 1 query. If there is a way to do it without using RawSQL in Django please let me know.
3. Extra things we can do with this API:
   - SearchRank helps rank searches and give them a rank score which you can use to filter the results.
   - SearchHighlight is mainly used with Django Templates and can be used to highlight the keywords of search in all results.
   - TrigramSimilarity and TrigramWord can be used to implement `Did you mean this?` and lookahead search features.
4. Coalesce is a function used in SQL. It's used here to return an empty string instead of null if the row value is NULL.
5. The weights can only be `A, B, C, D`. This is an implementation detail of Postgres.
6. Postgres can handle HTML in full text search. It will strip HTML tags(as well as common stop words like `a, an, the, this`) and only extract the relevant words.

Resources:

1. https://docs.djangoproject.com/en/4.2/ref/contrib/postgres/search/
2. https://gearheart.io/articles/how-to-use-django-postgresql-for-full-text-search/
3. https://www.paulox.net/2017/12/22/full-text-search-in-django-with-postgresql/
4. https://pganalyze.com/blog/full-text-search-django-postgres
