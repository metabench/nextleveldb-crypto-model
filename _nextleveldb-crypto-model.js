// Not sure exactly how useful this will be.
//  Active table seems like it could be the right way to access such records.

// Connected Table
//  Better implies it's client-side

// Having things run on the server - Active Table could still be useful for data access.

// Model_Connector or Database_Connector rather than Active_Database?
//  That way would allow different / inherited model DBs to be connected.

// Could make some kind of mixin system too.
//  Could also put all of the settings for the different type of DB into the spec.
//  Could make the subclasses the Connected versions, or make both versions using the same Model spec.









//  A simpler definition of the Model would help.








var Model = require('nextleveldb-model');
var jsgui = require('jsgui3');

var each = jsgui.each;


var Database = Model.Database;
var Table = Model.Table;
var Record = Model.Record;

// An OO db class, with a setup function.
//  Then could maybe use a connected version.

// Make this extend the crypto db class, extend the model with the new tables, but don't add data.
//  All we really have here are table and record definitions.
//  Could have a load_def function within database.

// Then it should not be too much of a stretch to watch bittrex, and load the records into the database.
//  Will then do work on record retrieval using various means.

// Want an easy to use crypto and asset storage system. Probablu have much of the basis already for information encoding and storage.

// Crypto model could do much that is needed for encoding of records.
//  Searches within index spaces should be relatively easy.

// crypto_db.add_def
//  a bunch of tables

// crypto_db.add_tables({...})




// Then should be able to load records to those tables relatively easily.
//  




// Database, but give it thwe 






// In the future - Model will get initialised with system table data from the db.



if (require.main === module) {
    var crypto_db = new Database();
    crypto_db.create_db_core_model();

    // Syntax for adding specific functionality will be easy, with OOP doing much of the work.

    // Indicate incrementor field with +id

    var view_decoded_rows = () => {
        var model_rows = crypto_db.get_model_rows();

        //throw 'stop';
        console.log('model_rows.length', model_rows.length);

        each(model_rows, (model_row) => {
            console.log('model_row', Database.decode_model_row(model_row));

        });


        console.log('\n\n\n');

        //throw 'stop';

        //var decoded_rows = crypto_db.get_model_rows_decoded();
        //console.log('decoded_rows', decoded_rows);
    }

    var view_rows = () => {
        var model_rows = crypto_db.get_model_rows();

        //throw 'stop';
        console.log('model_rows.length', model_rows.length);

        each(model_rows, (model_row) => {
            console.log('model_row', model_row);

        });


        console.log('\n\n\n');

        //throw 'stop';

        //var decoded_rows = crypto_db.get_model_rows_decoded();
        //console.log('decoded_rows', decoded_rows);
    }

    
    // Need to set up incrementors.

    // Could give it a main url, as well as other urls in an index.

    // Looks like this will need to be fixed - with some other parts of the system sorted out too.

    // Need to have the table constructor get fields from the storage def.
    //  Seems defined wrong for the constructor.

    /*
    tbl_market_providers = new Table('market providers', crypto_db, [
        [['+id'], ['name']],

        // Though the '+' sign is convenient syntax, it requires a bit of a hack to change it to the incrementor with the incrementor refernce.
        //  Could have incrementors linked to the table.
        //   Or the field has got an attached incrementor.


        //[['id'], ['name']],
        [[['name'], ['id']]]
    ]);
    */

    console.log('\npre new market providers');

    /*

    tbl_market_providers = new Table('market providers', crypto_db, [
        [['+id'], ['name']],

        // Though the '+' sign is convenient syntax, it requires a bit of a hack to change it to the incrementor with the incrementor refernce.
        //  Could have incrementors linked to the table.
        //   Or the field has got an attached incrementor.
        //[['id'], ['name']],
        [[['name'], ['id']]]
    ]);

    */



    tbl_market_providers = crypto_db.add_table('market providers', [
        [['+id'], ['name']],

        // Though the '+' sign is convenient syntax, it requires a bit of a hack to change it to the incrementor with the incrementor refernce.
        //  Could have incrementors linked to the table.
        //   Or the field has got an attached incrementor.
        //[['id'], ['name']],
        [[['name'], ['id']]]
    ]);
    //console.log('1) tbl_market_providers', tbl_market_providers);
    //throw 'stop';

    /*
    console.log('tbl_market_providers.fields.length', tbl_market_providers.fields.length);
    console.log('post new market providers\n');
    //console.log('1) tbl_market_providers', tbl_market_providers);
    
    // Should use the primary key incrementor when creating the record.
    //var rec_bittrex = tbl_market_providers.add_record([null, ['bittrex']]);
    //var rec_bittrex = tbl_market_providers.add_record([null, ['bitfinex']]);
    //console.log('rec_bittrex', rec_bittrex);
    
    console.log('pre add table tbl_market_providers');
    */

    //crypto_db.add_table(tbl_market_providers);





    /*

    console.log('post add table tbl_market_providers');
    //throw 'stop';
    view_rows();
    view_decoded_rows();

    console.log('tbl_market_providers', tbl_market_providers);
    console.log('tbl_market_providers.get_all_db_records_bin()', tbl_market_providers.get_all_db_records_bin());
    console.log('tbl_market_providers.records.length', tbl_market_providers.records.length);
    //throw 'stop';
    

    */
    


    // Future loading, a bit complex:
    //  Create the model we want in memory
    //  Load a model from the database.
    //  Diff the two of them
    //  Make updates for the live db
    //  Persist those updates
    


    // Generally updates will just be adding new tables.
    //  Dealing with tables with mismatched IDs could be tricky. Need to avoid that.
    //  Probably best just to use a loaded model, and add any tables that are necessary.

    // For the moment, want to create the model in memory, working for bitfinex, and then send those trades to the db.

    // Could load some kind of a JSON definition of the tables to use.
    //  Then, will not require much code to encode records, along with their index values.

    // A more complex thing...
    //  Having the server-side aware enough of the data to successfully index data.
    //   Would mean having a model running on the server.
    //  Seems like the model gets sent to the server as records.
    //   The server could know to refresh its internal model once that model changes.
    //   This meand being able to load a model out of records.
    //    Seems like a powerful capability.
    //     The server having access to the model would definitely be of use when it comes to
    //      Indexing records
    //      Looking up foreign key references

    // Having the server index records by itself looks like a very important feature / standard way the db works.
    //  Definitely want it so that encoded records that get sent to the server get indexed correctly.

    // However, sending indexed records from the client could be more efficient in terms of the server doing less work.



















    
    

    // This is where the incrementor would need to be put to use.

    // Special case for when a record has a null key.
    //  Will need to look up the field, then call get_value.
    //   The field would then get its value from the incrementor.

    // Adding a record with a null key - need to use the autoincrement.
    //  


    
    //throw 'stop';
    

    
    //var kv_bittrex = rec_bittrex.get_all_db_records_bin();
    
    //console.log('kv_bittrex', kv_bittrex);
    //throw 'stop';
    //console.log('2) tbl_market_providers', tbl_market_providers);
    //

    // Need to note that various indexes are unique

    // But get the types as well...
    //  Not sure they are needed though.
    //   Say we index by something, we index by its encoding.
    //    Basic encoding, there will likely be compressed encodings too.


    // And add a (unique) id as well.
    //  +id   because it's incremented.
    //   it's null or does not exist in data we get back as records.



    // Could make turning field names lower case an option.

    // Could have lower case indexes too.

    // ! prefix in name for unique.

    // +id as the first.
    //  the plus as the autoincrementor means we only need 1 key.
    //   then we specify that Currency and CurrencyLong have unique indexes.

    // This is a new type of storage definition.

    // An array that does not contain any arrays
    //  Only contains strings.

    // Won't be long until we have a well functioning DB that can accept bittrex values, and allow queries getting them from within ranges.
    //  Non-unique indexes will also be able to link to the record - the primary key will be stored within the key at the end, making the index unique.
    //   denote non-unique indexes with @
    //    for a single index?
    //    or @1, @2 etc
    //    want to avoid named indexes right now?

    // Will put them together into list of key and value.
    //  Will also make use of Index class for other database functionality.

    // This defines the fields.
    //  We may not have the data type for the field though.



    var bittrex_currency_keys = [
        '+id',

        // And the unique constraints as well.
        '!Currency',
        '!CurrencyLong',
        'MinConfirmation',
        'TxFee',
        'IsActive',
        'CoinType',
        'BaseAddress',
        'Notice'];

    // Having a Table_Fields table would be useful here.
    //  Would definitely be of use to represent the fields / field names within the table structure.
    //   Within the 'table fields' table.

    // Want to define indexes.
    //  index by Currency        (unique)
    //  index by CurrencyLong    (unique)
    
    // Add all of the named fields while making the table.



    tbl_bittrex_currencies = crypto_db.add_table('bittrex currencies', bittrex_currency_keys);



    //tbl_bittrex_currencies = new Table('bittrex currencies', crypto_db, bittrex_currency_keys);
    //console.log('tbl_bittrex_currencies.fields.length', tbl_bittrex_currencies.fields.length);
    //throw 'stop';
    //crypto_db.add_table(tbl_bittrex_currencies);

    //console.log('tbl_bittrex_currencies.fields.length', tbl_bittrex_currencies.fields.length);
    //throw 'stop';
    //  These are the indexes to use based on the bittrex data.
    // Currency, CurrencyLong

    /*
    [ 'Currency',
    'CurrencyLong',
    'MinConfirmation',
    'TxFee',
    'IsActive',
    'CoinType',
    'BaseAddress',
    'Notice' ],
    */

    // May be best to have the indexes put into the database within a table or table-like structure.
    //  As in, the definition of indexes.
    //  For the moment, it is tricky to encode or decode indexes.




    var btc_bittrex = ['BTC',
        'Bitcoin',
        2,
        0.001,
        true,
        'BITCOIN',
        '1N52wHoVR79PMDishab2XmRHsbekCdGquK',
        null];

    var ltc_bittrex = ['LTC',
        'Litecoin',
        6,
        0.002,
        true,
        'BITCOIN',
        'LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx',
        null]


    // Maybe not the right way to define a record.
    //  Normally need to give the key field.
    //  Need to handle giving an array in the constructor.
    //   It would automatically need to give it the pk value.






    var sia_bittrex = ["SC", "Siacoin", 6, 0.1, true, "SIA", null, null];

    // Something goes wrong adding the record...
    //  The record is missing an id.
    //   We should be able to see that it's length is too low. It's not split into keys and values.

    // Need to automatically give it a primary key.

    var rec_bittrex_btc = tbl_bittrex_currencies.add_record(btc_bittrex);
    // Bittrex currencies has an auto key field.
    //  Need to recognise this with add_record.
    //  The records collection maybe should keep a reference to the primary key field.
    //   Or check if there is a primary key field pk_field defined for the table's record_def.

    // Putting the keys in place as null.
    //  Need better record parsing so we don't need this.


    //btc_bittrex.splice(0, 0, null);
    //ltc_bittrex.splice(0, 0, null);
    //sia_bittrex.splice(0, 0, null);


    //console.log('rec_bittrex_btc', rec_bittrex_btc);

    var rec_bittrex_ltc = tbl_bittrex_currencies.add_record(ltc_bittrex);
    //console.log('rec_bittrex_ltc', rec_bittrex_ltc);


    //console.log('\npre add sia record');
    var rec_bittrex_sia = tbl_bittrex_currencies.add_record(sia_bittrex);
    //console.log('post add sia record\n');
    //throw 'stop';
    //console.log('rec_bittrex_sia', rec_bittrex_sia);
    //throw 'stop';

    //var obj_sia = rec_bittrex_sia.to_obj();
    //console.log('obj_sia', obj_sia);
    //throw 'stop';
    // should be able to get by a field.
    //  Maybe do more low level work to check that fields get put into the db correctly.
    //  

    // Before long, want to add plenty of data to a DB as well as retrieve it.
    //  Need to make sure various add and get queries are working properly.

    // May be worth building a result viewing web interface.



    // Want to add a trading pair, and have fields from that automatically normalised.






    //throw 'stop';
    //view_rows();
    //console.log('rec_bittrex_sia', rec_bittrex_sia);
    //view_decoded_rows();
    //throw 'stop';

    //var field_names = crypto_db.map_tables['bittrex currencies'].get_field_names();
    //console.log('field_names', field_names);

    // This is where a primary key made up from two values would be useful would come in handy.

    //  We can get rid of the currency names (normalise).
    //   Two of them together are the primary key

    // [['market_currency_id', 'base_currency_id'], the other fields]]

    // Key value pair, both are arrays.

    // Field alias
    //  Something like name would be nice.
    //  However, efficiently implementing it could be a bit complex. Maybe in a later version.
    //   Not sure I want more complexity to be added, rather than just using this to add plenty of records.

    // Having a 'name' field may make a lot of sense though.
    //  May want the field alias names to be enforced to be unique, also unique from the fields themselves.
    // Aliases would be very useful in order to keep the record structure from the original, while also being able to refer to them in a standard way.

    // For the moment though, making it so that it adds plenty of bittrex records would be very useful.

    // I think a crypto client that makes use of basically the existing features would be best.
    //  Avoiding having to make a general alias case, transform the records from the starting format, then put them into the DB.
    // But assigning our own numeric id would use less space?

    // may be possible to define foreign keys here?

    var bittrex_market_def = [
        // Primary key made up of 2 fields
        //  Need it to assign these two fields as being part of the PK.
        ['market_currency_id', 'base_currency_id'],

        // Value - the other fields
        ['MinTradeSize',

        // Definitely including types within the fields makes sense.
        //  Should be one of the more default things.
        //  Also is a reference to the native types table.

        'MarketName',
        'IsActive',
        'Created',
        'Notice',
        'IsSponsored',
        'LogoUrl']
    ]

    //tbl_bittrex_markets = new Table('bittrex markets', crypto_db, bittrex_market_def);
    // would have two foreign keys, both within the primary key.

    // want the foreign key for the primary key as well?
    //  They are still the PK, but together they refer to other tables.
    //   meaning we should be able to give it a market currency and base currency.

    // I think it's worth making more classes of this, and focusing on a crypto db client.
    //  Want to add plenty of data, and be able to retrieve it.

    // Could have OO classes that represent values on the client.
    //  Could be live data as well as data that already exists.
    //  Don't want to do much more work on the data structures.
    //   Have moved away from the plugins and encodings now, it's much more about record structure and flexible encoding.

    // Probably worth not making automatic foreign key lookup.
    //  Have a client that gets the right data first, then uploads the data with the correct keys.

    // Could do more work in the crypto collector?
    //  Making an OO class that handles many of the details makes sense.
    //  Keeps track of the various markets and currencies on various exchanges (their DB ids), and uses that info to put the records into place.

    tbl_bittrex_markets = crypto_db.add_table('bittrex markets', bittrex_market_def);
    tbl_bittrex_markets.set_fk('market_currency_id', tbl_bittrex_currencies);
    tbl_bittrex_markets.set_fk('base_currency_id', tbl_bittrex_currencies);

    //console.log('tbl_bittrex_markets', tbl_bittrex_markets);
    //throw 'stop';
    //crypto_db.add_table(tbl_bittrex_markets);

    view_rows();
    view_decoded_rows();

    // Have it add a market, with the normalization of the market record taking place...
    //  We could define the market records differently to how they arrive from bittrex.
    //   Further normalization would increase efficiency. Make lookups more complex though.



    // Very soon want to get trades put into the db with properly modeled records.
    //  Can do this on a remote database as well.


    // Also will have stage of recreating model from the db?
    //  That seems very useful for connecting to the db, without needing a saved version of the model running as part of the app.
    //  It would rely on there being all of the necessary data within the system tables.
    //   Reconstructing the model out of the first 4 tables in the database...
    //   Likely would have specialised startup routine with specialised loops to create the various objects.
    //   Or could assume the same basic core system table.
    //  Could store the version number of the core in the database.
    //   Warnings? Better errors? Specialised upgrade process? Could have model loaders for different versions.

    // Also, want fairly simple database definition files or objects.
    //  Possibly as JSON.
    //  Will get processed, constructors called. Items added to the db.


    // Make this OO?
    //  Return an object?







    


} else {
    //console.log('required as a module');
}