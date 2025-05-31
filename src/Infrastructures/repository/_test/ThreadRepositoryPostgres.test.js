// Import helper module for managing threads table in tests (e.g., inserting, cleaning threads)
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
// Import helper module for managing users table in tests (e.g., inserting, cleaning users)
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
// Import the abstract ThreadRepository interface to check inheritance
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
// Import the Postgres connection pool for database interactions
const pool = require("../../database/postgres/pool");
// Import the concrete implementation of ThreadRepository that works with Postgres
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
// Import the AddThread entity used to represent new thread data input
const AddThread = require("../../../Domains/threads/entities/AddThread");
// Import the AddedThread entity used to represent thread data after it has been added (with generated id)
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
// Import custom error class to represent "not found" errors
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

// Group tests for the ThreadRepositoryPostgres class
describe("ThreadRepositoryPostgres", () => {
  // Test to ensure that ThreadRepositoryPostgres is a proper implementation (instance) of ThreadRepository interface
  it("should be instance of ThreadRepository", () => {
    // Create an instance with dummy dependencies (empty objects)
    const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

    // Check if the instance is indeed of type ThreadRepository (interface inheritance)
    expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
  });

  // After each test, clean the threads and users tables to keep test environment isolated and clean
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable(); // Delete all threads
    await UsersTableTestHelper.cleanTable(); // Delete all users
  });

  // After all tests finish, close the database connection pool to free resources
  afterAll(async () => {
    await pool.end();
  });

  // Group tests related to the addThread function
  describe("addThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      // Arrange step: prepare initial data and dependencies

      // Add a user to the users table, which will be the owner of the thread
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });

      // Create a new AddThread entity instance with title, body, and owner id
      const newThread = new AddThread({
        title: "Dummy thread title",
        body: "Dummy thread body",
        owner: "user-123",
      });

      // Fake ID generator always returns "12345" to get deterministic test results
      const fakeIdGenerator = () => "12345";

      // Create ThreadRepositoryPostgres instance with real DB pool and fakeIdGenerator
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action step: perform the action we want to test - add the thread
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert step: verify the results

      // The returned addedThread should be an instance of AddedThread with the expected properties
      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: "thread-12345", // ID is generated with prefix 'thread-' + fake id '12345'
          title: "Dummy thread title",
          owner: "user-123",
        })
      );

      // Verify that the thread actually exists in the database by searching by its id
      const thread = await ThreadsTableTestHelper.findThreadsById(
        "thread-12345"
      );
      expect(thread).toHaveLength(1); // The thread should exist exactly once
    });
  });

  // Group tests related to checkAvailabilityThread function
  describe("checkAvailabilityThread function", () => {
    it("should throw NotFoundError if thread not available", async () => {
      // Create instance of ThreadRepositoryPostgres using real DB pool, no id generator needed here
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Define an id for a thread that does not exist
      const threadId = "thread-123";

      // Expect that calling checkAvailabilityThread on a non-existent thread id throws NotFoundError
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread(threadId)
      ).rejects.toThrow(NotFoundError);

      // Also check that the error message matches the expected string exactly
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread(threadId)
      ).rejects.toThrowError("thread tidak ditemukan!");
    });

    it("should not throw NotFoundError if thread available", async () => {
      // Create instance of ThreadRepositoryPostgres using real DB pool
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Prepare test data by inserting a user and a thread associated with that user
      await UsersTableTestHelper.addUser({
        id: "user-123",
        username: "dicoding",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        body: "Dummy thread body",
        owner: "user-123",
      });

      // Expect that checking availability of this existing thread id does NOT throw NotFoundError
      await expect(
        threadRepositoryPostgres.checkAvailabilityThread("thread-123")
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  // Group tests related to getDetailThread function
  describe("getDetailThread function", () => {
    it("should get detail thread", async () => {
      // Create instance of ThreadRepositoryPostgres with real DB pool
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Prepare user data that owns the thread
      const userPayload = {
        id: "user-123",
        username: "dicoding",
      };

      // Insert the user into users table
      await UsersTableTestHelper.addUser(userPayload);

      // Prepare thread data that references the user as owner
      const threadPayload = {
        id: "thread-123",
        title: "Dummy thread title",
        body: "Dummy thread body",
        owner: "user-123",
      };

      // Insert the thread into threads table
      await ThreadsTableTestHelper.addThread(threadPayload);

      // Call the getThread method to retrieve full thread detail (including username of owner)
      const detailThread = await threadRepositoryPostgres.getThread(
        threadPayload.id
      );

      // Assert that the detailThread's properties match what we expect from the inserted data
      expect(detailThread.id).toEqual(threadPayload.id);
      expect(detailThread.title).toEqual(threadPayload.title);
      expect(detailThread.body).toEqual(threadPayload.body);
      expect(detailThread.username).toEqual(userPayload.username); // username is fetched via join with users table
      expect(detailThread.date).toBeDefined(); // Assert that date property exists and is not undefined
      expect(new Date(detailThread.date)).toBeInstanceOf(Date);
    });
  });
});
