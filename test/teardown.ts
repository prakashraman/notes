import { after } from "mocha";
import mock from "mock-fs";

after(() => {
  mock.restore();
});
