import test from 'node:test';
import assert from 'node:assert/strict';

import { assembleProgram } from '../src/assembler.js';
import { curriculumTracks, lessonSources, syllabusSequence } from '../src/curriculumCatalog.js';
import { retroExamples } from '../src/educationContent.js';

function parseRawBytes(input) {
  return input.trim().split(/\s+/).filter(Boolean).map((token) => {
    const value = /^0x[0-9a-f]+$/i.test(token) ? parseInt(token, 16) : Number(token);
    assert.equal(Number.isInteger(value), true, `${token} should be an integer byte`);
    assert.equal(value >= 0 && value <= 255, true, `${token} should fit in one byte`);
    return value;
  });
}

test('all lesson examples are runnable or valid raw byte demos', () => {
  for (const example of retroExamples) {
    if (example.assemblyMode === false) {
      assert.ok(parseRawBytes(example.code).length > 0, `${example.id} should contain bytes`);
    } else {
      assert.doesNotThrow(() => assembleProgram(example.code), `${example.id} should assemble`);
    }
  }
});

test('lesson modules reference existing examples and sources', () => {
  const exampleIds = new Set(retroExamples.map((example) => example.id));

  for (const track of curriculumTracks) {
    for (const course of track.courses) {
      for (const module of course.modules) {
        assert.ok(module.lesson.sections.length > 0, `${module.id} should include sections`);
        assert.ok(module.lesson.practice.steps.length > 0, `${module.id} should include practice steps`);
        assert.ok(module.lesson.checks.length > 0, `${module.id} should include checks`);

        for (const sourceId of module.sourceIds) {
          assert.ok(lessonSources[sourceId], `${module.id} references missing source ${sourceId}`);
        }

        if (module.exampleId) {
          assert.ok(exampleIds.has(module.exampleId), `${module.id} references missing example ${module.exampleId}`);
        }
      }
    }
  }
});

test('learning path points to existing lessons', () => {
  for (const unit of syllabusSequence) {
    const track = curriculumTracks.find((entry) => entry.id === unit.trackId);
    assert.ok(track, `${unit.id} references missing track ${unit.trackId}`);

    const course = track.courses.find((entry) => entry.id === unit.courseId);
    assert.ok(course, `${unit.id} references missing course ${unit.courseId}`);

    const module = course.modules.find((entry) => entry.id === unit.lessonId);
    assert.ok(module, `${unit.id} references missing lesson ${unit.lessonId}`);

    for (const sourceId of unit.sourceIds) {
      assert.ok(lessonSources[sourceId], `${unit.id} references missing source ${sourceId}`);
    }
  }
});
