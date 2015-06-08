// Copyright 2015 by Paulo Augusto Peccin. See license.txt distributed with this file.

CartridgeASCII16K = function(rom) {
    var self = this;

    function init() {
        self.rom = rom;
        var content = self.rom.content;
        bytes = Util.arrayFill(new Array(content.length), 0xff);
        for(var i = 0, len = content.length; i < len; i++)
            bytes[i] = content[i];
    }

    this.powerOn = function(paused) {
        bank1Offset = -0x4000;
        bank2Offset = -0x8000;
    };

    this.powerOff = function() {
    };

    this.write = function(address, value) {
        if (address >= 0x6000 && address < 0x7000)
            bank1Offset = value * 0x4000 - 0x4000;
        else if (address >= 0x7000 && address < 0x8000)
            bank2Offset = value * 0x4000 - 0x8000;
    };

    this.read = function(address) {
        if (address < 0x8000)
            return bytes[bank1Offset + address];
        else
            return bytes[bank2Offset + address];
    };

    this.dump = function(from, quant) {
        var res = "";
        var i;
        for(i = from; i <= from + quant; i++) {
            res = res + i.toString(16, 2) + " ";
        }
        res += "\n";
        for(i = from; i <= from + quant; i++) {
            var val = this.read(i);
            res = res + (val != undefined ? val.toString(16, 2) + " " : "? ");
        }
        return res;
    };


    var bytes;

    var bank1Offset;
    var bank2Offset;

    this.rom = null;
    this.format = SlotFormats.Cartridge32K;


    // Savestate  -------------------------------------------

    this.saveState = function() {
        return {
            f: this.format.name,
            r: this.rom.saveState(),
            b: btoa(Util.uInt8ArrayToByteString(bytes)),
            b1: bank1Offset,
            b2: bank2Offset
        };
    };

    this.loadState = function(s) {
        this.rom = ROM.loadState(s.r);
        bytes = Util.byteStringToUInt8Array(atob(s.b));
        bank1Offset = s.b1;
        bank2Offset = s.b2;
    };


    if (rom) init();

};

CartridgeASCII16K.createFromSaveState = function(state) {
    var cart = new CartridgeASCII16K();
    cart.loadState(state);
    return cart;
};