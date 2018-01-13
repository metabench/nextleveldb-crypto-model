var Model = require('nextleveldb-model');
var lang = require('lang-mini');
var CoinMarketCap_Watcher = require('coinmarketcap-watcher');


var each = lang.each;
var tof = lang.tof;
var Fns = lang.Fns;

var Database = Model.Database;
var Table = Model.Table;
var Record = Model.Record;

// watcher vs more simple API?



var Bittrex_Watcher = require('bittrex-watcher');


// Want an easy output of the model
//  Explanation of the tables, indexes, fields


var table_defs = [
    [
        'market providers', [
        [
            ['+id'], ['name']
        ],
        [
            [['name'], ['id']]]
        ]
    ],

    // Does it create the table defs index properly?
    //  The id should be a value field within the index.
    //   Separate unique indexes for currency and currencylong


    [
        'bittrex currencies', [
            '+id',
            // And the unique constraints as well.

            // Need to be able to look these up. Need to know what field id each of them is.
            '!Currency',
            '!CurrencyLong',
            // Also while putting or ensuring records, need to ensure unique constraints.

            // Check if the table has records according to indexes.
            //  Find records by indexes.
            //  Only low level puts will automatically do overwrites.

            // Want index lookup and index lookups where we look up multiple at once.
            






            'MinConfirmation',
            'TxFee',
            'IsActive',
            'CoinType',
            'BaseAddress',
            'Notice'
        ]
    ],
    [
        'bittrex markets', [
            // Primary key made up of 2 fields
            //  Need it to assign these two fields as being part of the PK.
            //  These 2 primary keys will be needed together to identify a record.

            // May be worth defining these as a foreign key fields somehow.
            //  Want to point to the table they are fk to.

            // Need to change the field parser to look for ' fk=> '. Done that.
            //  Seems as though these don't get properly added as pk fields though.
            ['market_currency_id fk=> bittrex currencies', 'base_currency_id fk=> bittrex currencies'],

            //['market_currency_id', 'base_currency_id'],

            // Value - the other fields
            ['MinTradeSize',

                // Definitely including types within the fields makes sense.
                //  Should be one of the more default things.
                //  Also is a reference to the native types table.

                // Could have unique market name.
                //  That way it could be looked up faster.
                //  Table records / table should have an index lookup function too.

                // Indexing by market name breaks it for some reason.
                //  Indexing by market name looks important though.

                // More database functionality to 

                '!MarketName',
                //'MarketName',
                'IsActive',
                'Created',
                'Notice',
                'IsSponsored',
                'LogoUrl']
        ]
    ],

    // or defined by the market id and the timestamp
    //  more logical than another primary key.

    [
        'bittrex market summary snapshots',
        [
            //'+id',

            // Define this here as a foreign key field?
            //  And the market id is an array of 2 values.
            ['market_id fk=> bittrex markets',
            'timestamp'],

            ['last',
            'bid',
            'ask',
            'volume',
            'base_volume',
            'open_buy_orders',
            'open_sell_orders']
        ]

        // Then would need to have some way to transform the incoming rows into the values for the records.
        //  Then those records get made within the model, and should be easy enough to transfer to the database.

        // Also want to set up the database with its own version of the model running.
        //  This could be done by setting system table values, and having it reconstruct a model.
        //  Then it would be possible to give it the values in a less normalised form, or as they come in, and it converts them to the record format.

    ]

    // bittrex trades
    // bittrex order book snapshots
]

// Should probably hold a few variables in a cache. Maybe tables and their collections of records.
//  Want to do more to cache the structural records.
//  Could have an instruction to cache some tables in memory, in JavaScript. This would greatly speed up reading their values.





class NextlevelDB_Crypto_Model_Database extends Model.Database {
    'constructor'() {
        super(table_defs);
    }
    'config_top_bittrex'(n, callback) {
        var cmcw = new CoinMarketCap_Watcher();
        var crypto_db = this;
        cmcw.get_top_n_symbols_by_market_cap(n, (err, arr_top_25_symbols) => {
            if (err) { callback(err) } else {
                //console.log('arr_top_25_symbols', arr_top_25_symbols);
                // then get the bittrex ticker
                var bw = new Bittrex_Watcher();

                bw.get_at_all_currencies_info((err, at_all_currencies) => {
                    //console.log('at_all_currencies', at_all_currencies);
                    // then want to select the top 25 of these by symbols (Currency)

                    // select any with matching symbols.
                    // select matching by field value lookup
                    //  provide it with an array of the field values. it creates a truth map
                    var at_top_currencies = at_all_currencies.select_matching_field_values('Currency', arr_top_25_symbols);
                    //console.log('at_top_currencies', at_top_currencies);
                    //console.log('at_top_currencies.length', at_top_currencies.length);
                    // then we can use those top currencies to populate the database model
                    // then create records from this data.
                    // then add an array table of records to the existing table.

                    var tbl_bittrex_currencies = crypto_db.map_tables['bittrex currencies'];
                    tbl_bittrex_currencies.add_arr_table_records(at_top_currencies);
                    //console.log('tbl_bittrex_currencies', tbl_bittrex_currencies);
                    var top_bittrex_currency_symbols = at_top_currencies;
                    var bittrex_top_currency_symbols = at_top_currencies.get_arr_field_values('Currency');
                    //console.log('bittrex_top_currency_symbols', bittrex_top_currency_symbols);

                    // then get the market names for these.
                    //  will then lookup bittrex markets for these markets
                    // 
                    bw.get_arr_market_names_by_arr_currencies(bittrex_top_currency_symbols, (err, btx_top_market_names) => {
                        if (err) { callback(err); } else {
                            //console.log('btx_top_market_names', btx_top_market_names);

                            // Then with these market names, we get the market info, filetered by these market names

                            bw.get_markets_info_by_market_names(btx_top_market_names, (err, at_top_markets_info) => {
                                if (err) { callback(err); } else {
                                    // transform it to follow the fields.
                                    //console.log('at_top_markets_info', at_top_markets_info);
                                    //console.log('at_top_markets_info.length', at_top_markets_info.length);

                                    // then create records for each of these markets.
                                    var tbl_bittrex_markets = crypto_db.map_tables['bittrex markets'];

                                    var field_names = tbl_bittrex_markets.field_names;
                                    //console.log('field_names', field_names);

                                    // Would need to do some lookups on IDs.

                                    // Are we able to do that easily here?
                                    //  tbl_bittrex_currencies.get_record_by_index_value(0, field_name);

                                    // Should be able to look it up in the model's own index.

                                    // then for each of the values of the arr-table, go through it to lookup some of the values.
                                    //  need to look up the currency ids

                                    // create/get a map of currency ids by their name.

                                    var map_ids_by_currency = tbl_bittrex_currencies.get_map_lookup('Currency');
                                    //console.log('map_ids_by_currency', map_ids_by_currency);
                                    var arr_markets_records = [];
                                    var arr_market_names = [];

                                    each(at_top_markets_info.values, (v) => {
                                        //console.log('v', v);
                                        var str_market_currency = v[0];
                                        var str_base_currency = v[1];

                                        //arr_market_names.push(str_market_currency + '-' + str_base_currency);
                                        arr_market_names.push(str_base_currency + '-' + str_market_currency);
                                        
                                        var market_currency_key = map_ids_by_currency[str_market_currency];
                                        var base_currency_key = map_ids_by_currency[str_base_currency];

                                        var market_currency_id = market_currency_key[0];
                                        var base_currency_id = base_currency_key[0];

                                        //console.log('market_currency_id', market_currency_id);
                                        //console.log('base_currency_id', base_currency_id);

                                        // then reconstruct the record. We need the right fields for the record.
                                        var record_def = [[market_currency_id, base_currency_id], v.slice(4)];

                                        arr_markets_records.push(record_def);
                                        // then we have the base currency key values...
                                    });

                                    tbl_bittrex_markets.add_records(arr_markets_records);

                                    callback(null, true);


                                    // then start up a watcher.
                                    //  could keep it going for 20s or so.

                                    // or just do one download of market data.

                                    //throw 'stop';
                                    //console.log('at_top_markets_info.keys', at_top_markets_info.keys);
                                    //throw 'stop';

                                    //add_arr_table_records.get_ar_selected_fields(field_names);
                                    //tbl_bittrex_markets.add_arr_table_records(at_top_markets_info);

                                    // Could then download the latest data from bittrex, filtering by these markets.
                                    //  Then we could put them into market (latest) snapshot data tables.

                                    // We could then persist these to a live database at a later stage.
                                    //  We could do it from here more easily.

                                    // Or have a model db that connects to the main db, listens for trading events, and creates new rows to go to the live db.

                                    // Also test the live db normalising records automatically.
                                    //  Doing some implicit/automatic type conversions when it gets given a string.

                                    // Storing trade info...

                                    // Having it create snapshot records from the watcher would be useful.

                                    // bittrex_market_snapshots
                                    //  normalises by removing the market name, replaces it with bittrex market id.

                                    // have the watcher watch the given markets.
                                    //  it will keep getting market summary snapshots, and create the market summery records.

                                    // Want to get this running full-time on a server, or two.

                                    // Watcher: get the market summaries for these markets
                                    //  Could use some kind of selective market summary

                                    //console.log('arr_market_names', arr_market_names);

                                    // then retrieve the market summaries with these names
                                }
                            })
                        }
                    });
                    //select_matching_field_values
                    //view_decoded_rows();
                    //callback(null, at_top_currencies.get_arr_field_values('Currency'));

                    // Then get the bittrex markets related to those currencies
                    //  Needs to select from the markets ticker data.
                    // Ensure we have the relevant bittrex markets in the model.

                    // Need to have bittrex_timed_values
                    // bittrex_trades would need to be more comprehensive
                })
            }
        });
    }

    config_all_bittrex(callback) {
        //console.log('config_all_bittrex');
        var bw = new Bittrex_Watcher();
        var crypto_db = this;

        //this.view_decoded_rows();
        //throw 'stop';

        bw.get_at_all_currencies_info((err, at_all_currencies) => {
            //console.log('at_all_currencies', at_all_currencies);
            // then want to select the top 25 of these by symbols (Currency)

            // select any with matching symbols.
            // select matching by field value lookup
            //  provide it with an array of the field values. it creates a truth map
            //var at_top_currencies = at_all_currencies.select_matching_field_values('Currency', arr_top_25_symbols);
            //console.log('at_top_currencies', at_top_currencies);
            //console.log('at_top_currencies.length', at_top_currencies.length);
            // then we can use those top currencies to populate the database model
            // then create records from this data.
            // then add an array table of records to the existing table.

            var tbl_bittrex_currencies = crypto_db.map_tables['bittrex currencies'];
            tbl_bittrex_currencies.add_arr_table_records(at_all_currencies);
            //console.log('tbl_bittrex_currencies', tbl_bittrex_currencies);
            //var top_bittrex_currency_symbols = at_top_currencies;
            var bittrex_currency_symbols = at_all_currencies.get_arr_field_values('Currency');
            //console.log('bittrex_top_currency_symbols', bittrex_top_currency_symbols);

            // then get the market names for these.
            //  will then lookup bittrex markets for these markets
            // 

            // 

            bw.get_markets_info((err, at_markets_info) => {
                if (err) { callback(err); } else {
                    // transform it to follow the fields.
                    //console.log('at_top_markets_info', at_top_markets_info);
                    //console.log('at_top_markets_info.length', at_top_markets_info.length);

                    // then create records for each of these markets.
                    var tbl_bittrex_markets = crypto_db.map_tables['bittrex markets'];

                    var field_names = tbl_bittrex_markets.field_names;
                    //console.log('field_names', field_names);

                    // Would need to do some lookups on IDs.

                    // Are we able to do that easily here?
                    //  tbl_bittrex_currencies.get_record_by_index_value(0, field_name);

                    // Should be able to look it up in the model's own index.

                    // then for each of the values of the arr-table, go through it to lookup some of the values.
                    //  need to look up the currency ids

                    // create/get a map of currency ids by their name.

                    var map_ids_by_currency = tbl_bittrex_currencies.get_map_lookup('Currency');
                    //console.log('map_ids_by_currency', map_ids_by_currency);
                    var arr_markets_records = [];
                    //var arr_market_names = [];

                    each(at_markets_info.values, (v) => {
                        //console.log('v', v);
                        var str_market_currency = v[0];
                        var str_base_currency = v[1];

                        //arr_market_names.push(str_market_currency + '-' + str_base_currency);
                        //arr_market_names.push(str_base_currency + '-' + str_market_currency);
                        
                        var market_currency_key = map_ids_by_currency[str_market_currency];
                        var base_currency_key = map_ids_by_currency[str_base_currency];

                        var market_currency_id = market_currency_key[0];
                        var base_currency_id = base_currency_key[0];

                        //console.log('market_currency_id', market_currency_id);
                        //console.log('base_currency_id', base_currency_id);

                        // then reconstruct the record. We need the right fields for the record.
                        var record_def = [[market_currency_id, base_currency_id], v.slice(4)];

                        arr_markets_records.push(record_def);
                        // then we have the base currency key values...
                    });

                    tbl_bittrex_markets.add_records(arr_markets_records);

                    callback(null, true);
                }
            })
        })
    }

    


    // Need more clarity about steps:
    //  Remote db -> model, download -> model, model -> remote db

    // A standard process where it loads a set of data / gets given it (from existing db), then it downloads the set of data fresh, then it sees which records are
    //  missing or changed. It then persists that data to the remote NextLevelDB.

    // Load_Update_Persist
    // Load_Augment_Persist
    // Load_Download_Persist
    // Load_Process_Persist
    // Load_Process_Save

    // Load, process, save looks like a decent standard or API to work with.

    // Could define various load process save functions.

    // LPS bittrex currencies.
    //  These should maybe not be here. Maybe just process.

    // Load within the thing that has the model, gives the model rows to load or add.
    //  Load records to model, check they don't already exist.

    // 2 sets of records would be added to the model, and model functionality used to merge them effectively. Prevents sending unnecessary updates, get to observe
    //  what some updates are.







    

    // Possibly first step is to load this data up from the server.
    //  Then ensure the records that arrive.

    download_ensure_bittrex_currencies(callback) {
        // 

        // Ensures the currencies within the model.



        var bw = new Bittrex_Watcher();
        //bw.get_at_all_currencies_info();

        /*
        Fns([
            [bw.get_at_all_currencies_info, bw, []]//,
            //[bw.get_at_all_markets_info, bw, []],
        ]).go((err, res_all) => {
            var [at_currencies, at_markets] = res_all;
            console.log('at_currencies.length', at_currencies.length);
            console.log('at_markets.length', at_markets.length);

        })
        */
        var that = this;

        bw.get_at_all_currencies_info((err, at_c) => {
            if (err) { callback(err); } else {
                //console.log('at_c.length', at_c.length);
                //console.log('at_c.keys', at_c.keys);

                that.ensure_table_records_no_overwrite('bittrex currencies', at_c.values);



                // Then put records / ensure records.
                //  Ensure will have the option of changing the values




                // ensuring records, meaning if they are already there, then don't put them.
                //  No overwrite

                // Having done that in the Model, we want to ensure these records from the model are in the database.
                
                // Could have another check to see that it does not overwrite any of the data in the database.

                // Anyway, persist the bittrex currencies table to the db.
                //  But that does not happen in the model.


                




            }
        });
    }

    ensure_bittrex_currency(kv_currency) {
        var tbl_c = this.map_tables['bittrex currencies'];

        // Have a map of the record's keys within the table records.
        //  That's not the normal indexing system.

        tbl_c.key_lookup
    }

    ensure_bittrex_currencies(arr_currencies) {
        // for each of them, try to get them by key from the model (this)

        each(arr_currencies, (kv_currency) => {

        })

    }

    'get_bittrex_market_summary_records_filtered_by_market_name'(arr_market_names, callback) {
        var map_ids_by_market = tbl_bittrex_markets.get_map_lookup('MarketName');
        //console.log('map_ids_by_market', map_ids_by_market);

        // How to look up these items from an index?
        //  Or we use these together, in an array, to represent the PKs.
        //  Fine to have a PK as an actual array of values.

        //throw 'stop';

        // Don't need to add the market summaries here.
        //  Could just get (bittrex) market summary records.
        
        // Could have a number of getter functions for different exchanges all organised.

        bw.get_market_summaries_filter_by_arr_market_names(arr_market_names, (err, at_market_summaries) => {
            if (err) { callback(err); } else {
                //console.log('at_market_summaries', at_market_summaries);

                // Then compose those market summaries into db records.
                var arr_market_summary_records = at_market_summaries.transform_each((value) => {
                    //console.log('value', value);
                    //console.log('at_market_summaries.keys', at_market_summaries.keys);

                    //var s_marketname = value[0].split('-');

                    var str_market_name = value[0];

                    //var str_base_currency, str_market_currency;

                    /*

                    [str_base_currency, str_market_currency] = str_market_name.split('-');
                    var i_base_currency = map_ids_by_currency[str_base_currency];
                    var i_market_currency = map_ids_by_currency[str_market_currency];

                    console.log('i_base_currency', i_base_currency);
                    console.log('i_market_currency', i_market_currency);

                    */

                    var market_key = map_ids_by_market[str_market_name];
                    //console.log('market_key', market_key);

                    // then look up the market ids from a lookup


                    // parse the date string to JavaScript Date object, output to milliseconds.


                    var d = Date.parse(value[6]);
                    //console.log('tof(d)', tof(d));
                    //console.log('d', d);
                    //var i_d = d.getTime();
                    
                    var res = [[market_key, d], [value[4], value[7], value[8], value[3], value[5], value[9], value[10]]];

                    /*
                    ['market_id fk=> bittrex markets',
                    'timestamp'],

                    ['last',
                    'bid',
                    'ask',
                    'volume',
                    'base_volume',
                    'open_buy_orders',
                    'open_sell_orders']
                    */

                    return res;

                });

                //console.log('arr_market_summary_records', arr_market_summary_records);

                // then add those records to the market snapshots table

                var tbl_bittrex_markets = crypto_db.map_tables['bittrex market summary snapshots'];

                tbl_bittrex_markets.add_records(arr_market_summary_records);

                // More functionality in the client would help.
                //  Being able to get these add record operations done through the client.
                //  Being able to transmit a model / the system tables
                //   Give a model to a client, and get that client to verify that the server is operating with that model.
                //    Could use a Model checksum.

                // Would create the records rather than adding them to the model.
                //  Fine to do if these records are not structural, ie not used to support other neccessary records.
                //   Market info is structural in terms of supporting the trade and snapshot info.

                // var new_records = tbl_bittrex_markets.new_records(arr_market_summary_records);
                // console.log('new_records', new_records);

                // Then the records to array form.
                //  Could have a RecordCollection in a more active form.
                //  Could post that record collection to the db.

                // This is just an array of Record objects.
                //  Maybe could return a Record collection.

                // Want to turn this array of records into compressed db data easily.
                //  Will do things like send an array of records within a put command.

                // Will want to do that frequently too.
                //  The database client could be useful for this.
                
                // Worth being able to send update packets...
                //  This is probably enough work for this model here.

                // Crypto collector could be a better module to join them together with.

                // Making the crypto model able to download info to define itself sounds very useful.
                //  We want to do that, then have it send that whole model to the server.
                //  (The server should then load that model.)

                // To start with, we only really need to send the data to the server to be stored.
                //  Having the server hold a representaion of the model would help it to respond to queries.
                //  For the most efficient running though, the server should do as little as possible.

                // Should keep sending those records to the database.

                // Worth getting it sending for a while.
                //  Could then define queries on the client side for the key range searches.

                // We should be able to keep adding records.
                //  Should also be able to use a model db to create records that are not added.

                // Should also be able to read from the DB into a normalised kind of way.

                // Want to be able to set up a DB, via the client or on the server, using a lot of Model functionality.

                //throw 'stop';
                callback(null, true);
            }
        });
    }
}




if (require.main === module) {
    var crypto_db = new NextlevelDB_Crypto_Model_Database();
    //throw 'stop';
    // Try loading the data with content from bittrex...

    // All of the bittrex markets.
    //  Should be quite easy to add them to the bittrex markets table.
    //  Possibly though, Active Table tech would help with this.
    //   Or could just do all of it in the model.
    // Would be nice to make the collector create records to go in this model.

    // Active Table and Active Record tech could help this quite a lot - make the code concise.
    //  Create new records within the model.
    //  Coordinate them within the code for the moment, active record could be used a bit later on, possibly developing out of what I write here.

    var view_decoded_rows = () => {
        var model_rows = crypto_db.get_model_rows();
        //console.log('model_rows.length', model_rows.length);

        each(model_rows, (model_row) => {
            console.log('model_row', Database.decode_model_row(model_row));
        });
        console.log('\n\n\n');
    }
    //view_decoded_rows();

    var test_remodel = () => {
        var model_rows = crypto_db.get_model_rows();
        each(model_rows, (model_row) => {
            console.log('1) model_row', Database.decode_model_row(model_row));
        });
        


        var buf = crypto_db.get_model_rows_encoded();



        console.log('buf', buf);

        // Looks like the loading of the model rows does not work correctly?
        //  Actually, it's the definition of the table that gets created wrong because it does not also assign it the 4th incrementor.

        var m2 = Model.Database.load_buf(buf);
        var model_rows_2 = m2.get_model_rows();
        each(model_rows_2, (model_row) => {
            console.log('2) model_row', Database.decode_model_row(model_row));
        });

        crypto_db.view_decoded_rows();



    }
    test_remodel();

    // view tables index info.
    //  go through each table, get info on which fields index how.
    // 'bittrex currencies' indexes in particular.

    //var tbl_bittrex_currencies = crypto_db.map_tables['bittrex currencies'];
    //console.log('tbl_bittrex_currencies.record_def', tbl_bittrex_currencies.record_def);
    //console.log('tbl_bittrex_currencies.record_def.indexes', tbl_bittrex_currencies.record_def.indexes);

    // 09/10/2017 - So the indexes on this table have not been set up properly.
    //  Need to be loaded with their key fields and value fields.
    //console.log('tbl_bittrex_currencies.record_def.indexes', tbl_bittrex_currencies.record_def.indexes);
    


    add_some_crypto_data = (callback) => {

        // Will move this internally to config_top_bittrex


        // bittrex currencies.
        //  see if we can get the top 10.
        // use coinmarket cap to get top 25 coins.
        
    }

    var test_with_crypto_data = () => {

        // Config function could first check for the existance of them already.
        //  config_all_bittrex

        // crypto_db.config_top_bittrex(25, (err, res_config) => {
        crypto_db.config_all_bittrex((err, res_config) => {
            if (err) { throw err; } else {
                console.log('res_config', res_config);
                view_decoded_rows();

                // This model db could be persisted relatively easily to a new database.
                //  Checksums of the model make a lot of sense.

                // Possibly not checksums on incrementors?
                //  Or some specific incrementors but not others.

            }
        })
    }
    //test_with_crypto_data();

    // The model table gets put together with two pk fields on 


    var pk_c = crypto_db.map_tables['bittrex currencies'].record_def.pk;
    //console.log('pk_c.length', pk_c.length);

    var pk_m = crypto_db.map_tables['bittrex markets'].record_def.pk;
    //console.log('pk_m.length', pk_m.length);

    //console.log('pk_c', pk_c);


    // Can have more functions to plug it into a live database.
    //  Model transferring.
    //  Deleting and replacing the remote db.
    


} else {
    //console.log('required as a module');
}

NextlevelDB_Crypto_Model_Database.table_defs = table_defs;

module.exports = NextlevelDB_Crypto_Model_Database;