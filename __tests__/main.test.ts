/* eslint-disable filenames/match-regex */
/* eslint-disable i18n-text/no-en */

import * as core from '@actions/core';

// Mock console.log to avoid noise in test output
jest.spyOn(console, 'log').mockImplementation();

describe('getInputs function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should include pr-number input parameter', () => {
    // Mock core.getInput to return test values
    const mockGetInput = jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        'jira-user': 'test-user',
        'jira-token': 'test-token',
        'jira-base-url': 'https://test.atlassian.net',
        'github-token': 'test-github-token',
        'skip-branches': '',
        'skip-comments': 'false',
        'skip-jira-table': 'false',
        'pr-threshold': '800',
        'validate-issue-status': 'false',
        'fail-on-error': 'true',
        'pr-number': '123',
      };
      return inputs[name] || '';
    });

    const mockGetMultilineInput = jest.spyOn(core, 'getMultilineInput').mockReturnValue([]);

    // Import and call the getInputs function directly
    const { getInputs } = require('../src/main');
    const result = getInputs();

    // Verify that pr-number input is read
    expect(mockGetInput).toHaveBeenCalledWith('pr-number', { required: false });

    // Verify the result includes the pr-number
    expect(result.prNumber).toBe('123');

    // Verify other expected calls
    expect(mockGetInput).toHaveBeenCalledWith('jira-user', { required: true });
    expect(mockGetInput).toHaveBeenCalledWith('jira-token', { required: true });
    expect(mockGetInput).toHaveBeenCalledWith('jira-base-url', { required: true });
    expect(mockGetInput).toHaveBeenCalledWith('github-token', { required: true });

    mockGetInput.mockRestore();
    mockGetMultilineInput.mockRestore();
  });

  it('should handle empty pr-number input', () => {
    const mockGetInput = jest.spyOn(core, 'getInput').mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        'jira-user': 'test-user',
        'jira-token': 'test-token',
        'jira-base-url': 'https://test.atlassian.net',
        'github-token': 'test-github-token',
        'skip-branches': '',
        'skip-comments': 'false',
        'skip-jira-table': 'false',
        'pr-threshold': '800',
        'validate-issue-status': 'false',
        'fail-on-error': 'true',
        'pr-number': '', // Empty pr-number
      };
      return inputs[name] || '';
    });

    const mockGetMultilineInput = jest.spyOn(core, 'getMultilineInput').mockReturnValue([]);

    // Import and call the getInputs function directly
    const { getInputs } = require('../src/main');
    const result = getInputs();

    expect(mockGetInput).toHaveBeenCalledWith('pr-number', { required: false });

    // Verify the result includes empty pr-number
    expect(result.prNumber).toBe('');

    mockGetInput.mockRestore();
    mockGetMultilineInput.mockRestore();
  });
});
