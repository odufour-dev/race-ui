import { jest } from '@jest/globals';
import { Files } from '../../src/tools/files.js'; // Ajuste le chemin selon ta structure

describe('Files Class', () => {
    let mockFs;
    let mockPath;
    let mockLogger;
    let files;
    const ROOT = '/app/data';

    beforeEach(() => {
        // Mock de fs
        mockFs = {
            existsSync: jest.fn(),
            mkdirSync: jest.fn(),
            readdirSync: jest.fn(),
            readFileSync: jest.fn(),
            writeFileSync: jest.fn(),
        };

        // Mock de path
        mockPath = {
            join: jest.fn((...args) => args.filter(Boolean).join('/')),
        };

        // Mock du logger
        mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
        };

        files = new Files(mockPath, mockFs, ROOT, mockLogger);
    });

    test('rootfolder getter should return the correct root', () => {
        expect(files.rootfolder).toBe(ROOT);
    });

    test('exists() should call fs.existsSync', () => {
        mockFs.existsSync.mockReturnValue(true);
        const result = files.exists('test.txt');
        
        expect(mockFs.existsSync).toHaveBeenCalledWith('test.txt');
        expect(result).toBe(true);
    });

    test('joinAbsolutePath() should prepend root folder', () => {
        const result = files.joinAbsolutePath('subdir', 'file.db');
        
        expect(mockPath.join).toHaveBeenCalledWith(ROOT, 'subdir', 'file.db');
        expect(result).toBe(`${ROOT}/subdir/file.db`);
    });

    test('joinPath() should join segments without root', () => {
        const result = files.joinPath('a', 'b');
        expect(mockPath.join).toHaveBeenCalledWith('a', 'b');
        expect(result).toBe('a/b');
    });

    test('mkdir() should call fs.mkdirSync with default options', () => {
        files.mkdir('/new-dir');
        expect(mockFs.mkdirSync).toHaveBeenCalledWith('/new-dir', { recursive: true });
    });

    test('readAbsoluteDir() should join root and call readdirSync', () => {
        mockFs.readdirSync.mockReturnValue(['file1.txt']);
        const result = files.readAbsoluteDir('my-folder');
        
        expect(mockPath.join).toHaveBeenCalledWith(ROOT, 'my-folder');
        expect(mockFs.readdirSync).toHaveBeenCalledWith(`${ROOT}/my-folder`);
        expect(result).toEqual(['file1.txt']);
    });

    test('readDir() should call readdirSync directly', () => {
        files.readDir('/direct/path');
        expect(mockFs.readdirSync).toHaveBeenCalledWith('/direct/path');
    });

    test('readAbsoluteFile() should join root and call readFileSync', () => {
        mockFs.readFileSync.mockReturnValue('content');
        const result = files.readAbsoluteFile('config.json', 'ascii');
        
        expect(mockPath.join).toHaveBeenCalledWith(ROOT, 'config.json');
        expect(mockFs.readFileSync).toHaveBeenCalledWith(`${ROOT}/config.json`, 'ascii');
        expect(result).toBe('content');
    });

    test('readFile() should call readFileSync with default encoding', () => {
        files.readFile('test.txt');
        expect(mockFs.readFileSync).toHaveBeenCalledWith('test.txt', 'utf8');
    });

    test('writeFile() should call writeFileSync', () => {
        const data = JSON.stringify({ id: 1 });
        files.writeFile('out.json', data, 'utf16le');
        
        expect(mockFs.writeFileSync).toHaveBeenCalledWith('out.json', data, 'utf16le');
    });
});