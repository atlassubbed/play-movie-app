# play-movie-app

A neat little app for searching movies, powered by TMDB's API.

---

### preface 

I initially wanted to flesh this out to be more impressive. I ended up looking into flow and transpiling server-side code (to eventually add SSR support; worst-case, we can just use `h`), however these features were not necessary to deliver the MVP and it would've taken me longer to research and implement it.

### installation

  Make sure you have git, Node.js and npm installed.

  1. `git clone https://github.com/atlassubbed/play-movie-db` to download project.
  2. `npm install` to install all dependencies.

### running the app

  Make sure you have a valid TMDB v3 API key.

  1. `export TMDB_API_KEY=<your_api_key>` 
  2. `npm run dev` to start the web server and API server.
  3. Visit `localhost:3000` to see the React app.

  You can also bundle the min/gzipped client into `dist/` with `npm run build`.

### tools

I wrote a basic webpack 4 boilerplate generator last year. It supports minification, compression, content-hashed filenames, running dev servers, and testing client-side code. I'm using it here instead of `create-react-app`. I'm sure `create-react-app` is pretty straightforward, but vanilla webpack is probably sufficient for this project.

### potential optimizations

  1. **Server-side rendering**
      * since all clients are given the exact same initial list of popular movies
      * can keep it pre-rendered on the server
        * pipe the html down immediately
        * use `ReactDOM.hydrate` on the client
      * would probably require transpiling server code, or we could use hyperscript.

  2. Use **Redis to cache** API requests
      * map query-params -> results
      * if we can can find query-params key in Redis, use the cached result instead of hitting TMDB API
      * this could help alleviate problems if we're running into TMDB API limits.
      * assumption: movie data doesn't change that much, tau\* can be large.
        * if some data changes more often than other data, we can define many tau<sub>i</sub>
      * pretty sure redis has a "set record and delete after X milliseconds"
        * if not, include a unix date with each record so that tmdb-api servers can do `if (Date.now() - storedDate > tau) tmdbAPI.rerequest(...)`
          * this could lead to blow-up in memory usage on redis
          * need some way of ensuring cached elements are *removed* when tau\* expires
      * need to investigate if redis has a "get and lock" query
        * otherwise, we'll just do our best SET and a lua script?
        * there is a potential race condition, explained below.
      * things to cache
        * movie details
        * genre searches
        * most popular movies list
      * things not to cache
        * movies lists returned from search queries, since these are open-ended and are likely to be unique

  3. Use an additional **client-side store to cache** API requests
      * map query-params -> results
      * if the client already made a request within tau\*, immediately use the cached result.
      * this could help make the client have a really responsive UX.

  4. use `fork` to make use of a **multi-core server**
      * each server can talk to redis
      * potentially use [shared data](http://2ality.com/2017/01/shared-array-buffer.html) (ES8) to further cache results in-memory? Haven't used this before, would have to look into it.
      * load balancer can take requests and distribute them across the instances

  \*<sup>tau is the cache-invalidation time</sup>

### potential changes

  1. Serve the API over https only?
  2. API should be in a separate repo?

### other notes

#### windows

Windows server support isn't tested right now. I'd imagine there might be potential hiccups due to using `".."`, `__dirname`, and/or `\n`, but we can cross that bridge later.

#### web server

I'm assuming that the web server is decoupled from the API server to separate concerns. 

#### chrome

Just use desktop Chrome, this isn't tested on mobile or IE.

#### race conditions with redis caching

Suppose TMDB has a movie M with data m1, we have two API servers (s1 and s2) and a client connected to each server (c1 and c2, respectively), and that redis currently has no cached data.

```
time ->

TMDB ---------------------->set M to m2

                                           /--set redis M to m2-->
                                          /
s1   --get redis M--->null----req TMDB--->m2--send m2 to c1-->

                                        /------set redis M to m1-----> // last to set cache
                                       /    
s2   --get redis M--->null--req TMDB-->m1--send m1 to c2-->
```

In the above scenario, c1 is sent m2 (the newest data), but the cache ends up with m1 (the older data). If c1 were to refresh the page immediately, he would be sent m1, meaning he "saw the future" before he was supposed to. This shouldn't be an issue for "the lion king 1994" because it's not going to change, but could be a potential issue for "the witcher series 2020" because its details may change.

IMHO this doesn't matter that much since we are caching anyway, meaning we are clearly willing to accept a margin of error (tau) on the recency of the data. Do we care if a client may end up stuck with older data than they already saw? Does it matter if we're doing repeated requests for the initial (or after expiration) caching?
