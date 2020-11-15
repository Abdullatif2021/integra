import { ActionsService } from './../../app/service/actions.service';
export const itl = {
     core: {

        global_modals: {

            address_scheduling: {
                value: 'Vuoi ripianificare gli indirizzi non assegnati o pianificare solo i nuovi indirizzi.'
            },
            just_new: {
                value: 'Solo i nuovi'
            },
            reschedule: {
                value: 'Ripianifica tutto'
            },
            products_added: {
                value1: 'Ci sono',
                value2: 'prodotti nella lista da consegnare della stessa categoria e stessa strada che non sono aggiunti, i prodotti saranno aggiunti automaticamente prima di creare le'
            },
            category: {
                value: 'Category'
            },
            barcode: {
                value: 'Barcode'
            },
            recipient: {
                value: 'Recipient'
            },
            address: {
                value: 'Address'
            },
            button: {
                value1: 'Continua',
                value2: 'Annulla'
            },


        },
        main_nav: {
            to_be_delivered: {
                value: 'Da consegnare'
            },
            pre_bill: {
                value: 'Pre-Distinta'
            },
            bills_in_prepare: {
                value: 'Distinte in preparazione'
            },
            bills_in_delivery: {
                value: 'Distinte in consegna'
            },
            in_stock: {
                value: 'In giacenza'
            },
            non_consegnati: {
                value: 'Non consegnati'
            }
        },
        search_panal: {
            search: {
                value: 'Cercaa',
                place_holder: 'Cerca',
                place_holder2: 'Nel Campo'
            },
            filter: {
                value: 'Filtra',
                btn_reset: 'Azzera',
                btn_research: 'Ricerca'
            },
            action_select: {
                button: 'Esegui',
                place_holder1: 'Scegli un\'operazione'
            },
            // If input is group
            filters_changed: {
                value: 'ATTENZIONE! Alcuni filtri sono stati cambiati e non applicati, sei sicuro di voler eseguire ?',
                without_applying: 'Esegui senza Applicare',
                run: 'Applica ed Esegui',
                close: 'Chiudi',
                no_result: 'Nessun risultato'
            }


        },
        user_nav: {
            user_name: 'Adnan Kharboutli',
            action1: 'Action',
            action2: 'Another Action',
            action3: 'Another Action',
             }
    },
    home: {
        modals: {
            dispatch_assign: {
                filter_applied: 'ATTENZIONE! Non è stato applicato nessun filtro, sei sicuro di voler eseguire?',
                run: 'Esegui',
                go_out: 'Esci',
                no_select: ' Nessuna riga selezionata !',
                create_one: 'Crea nuova Pre-Distinta',
                about_try: 'ATTENZIONE! Stai per processare',
                correct_quantity: ' righe. Assicurati che la quantità sia corretta,altrimenti riprova o contatta l\'assistenz. Premi su Conferma se non hai dubbi sull\'operazione.',
                select_continue: 'You must select a user to continue!',
                preper_bag: 'Operatore che prepara la borsa',
            },
            dispatch_delete: {
                delete: 'Sei sicuro di voler cancellare le distinte selezionate? ',
                no_select: ' Nessuna riga selezionata !',
                run: 'Esegui',
                cancel: 'Annulla'
            },
            dispatch_prepare: {
                filter_applied: 'ATTENZIONE! Non è stato applicato nessun filtro, sei sicuro di voler eseguire?',
                run: 'Esegui',
                go_out: 'Esci',
                no_select: ' Nessuna riga selezionata !',
                about_try: 'ATTENZIONE! Stai per processare',
                correct_quantity: ' righe. Assicurati che la quantità sia corretta,altrimenti riprova o contatta l\'assistenz. Premi su Conferma se non hai dubbi sull\'operazione.',
                bag_ready: 'Sei sicuro che le borse sono pronte?'

            },
            import_from: {
                import_col: 'Colonne da Importare',
                total_lines: 'Totale righe: ',
                run: 'Esegui',
                go_out: 'Esci'
            },
            pre_add: {
                add_existing: 'Aggiungi a Pre-distinta esistente',
                about_try: 'ATTENZIONE! Stai per processare',
                correct_quantity: ' righe. Assicurati che la quantità sia corretta,altrimenti riprova o contatta l\'assistenz. Premi su Conferma se non hai dubbi sull\'operazione.',
                no_select: 'Pre Dispatch is not selected',
                distinte: 'Pre-distinte:',
                run: 'Esegui',
                go_out: 'Esci',
                used_products: 'Questi prodotti sono stati già usati in un\'altra pre-distinta',
                ok: 'Ok'
            },
            pre_direct: {
                filter_applied: 'ATTENZIONE! Non è stato applicato nessun filtro, sei sicuro di voler eseguire?',
                run: 'Esegui',
                go_out: 'Esci',
                create_one: 'Crea nuova Pre-Distinta',
                about_try: 'ATTENZIONE! Stai per processare',
                correct_quantity: ' righe. Assicurati che la quantità sia corretta,altrimenti riprova o contatta l\'assistenz. Premi su Conferma se non hai dubbi sull\'operazione.',
                Confirm: 'Confirm Operation !'
            },
            pre_delete: {
                dele_prod: 'Sei sicuro di voler cancellare questo prodotto?',
                no_select: ' Nessuna riga selezionata !',
                run: 'Esegui',
                cancel: 'Cancel',
                go_out: 'Esci',
                canot_dele: 'Non puoi eliminare la pre-distinta mentre che c\'è un processo in lavorazione, pausa il processo e riprova a eliminarla.',
                ok: 'Ok',
                dele_adres: 'Questa pre-distinta ha dei prodotti in pianificazione, questa azione eliminerà solo I prodotti che sono nella tab in indirizzi. Sei sicuro di voler continuare?',
                unable: 'Non è stato in grado di eliminare questo pre-distinta, perché sono in esecuzione.'
            },
            pre_edit: {
                modifi: 'Modifica pre-distinta',
                req_name: 'Il nome è obbligatorio',
                name_lenth1: 'Il nome deve essere più di 3 caratteri',
                enter_name: 'Inserisci Nome Pre-Distinta',
                place_holder: 'Nome',
                save: 'Salva',
                go_out: 'Esci',
                quit: 'Sei sicuro di voler uscire?',
                yes: 'Si',
                no: 'No'
            },
            pre_merge: {
                filter_applied: 'ATTENZIONE! ci sono dei filtri non applicati. Per continuare e necessario applicarli, vuoi pracedere',
                run: 'Esegui',
                go_out: 'Esci',
                united: 'Pre-Distinte Uniti',
                about_try: 'ATTENZIONE! Stai per processare',
                correct_quantity: ' righe. Assicurati che la quantità sia corretta,altrimenti riprova o contatta l\'assistenz. Premi su Conferma se non hai dubbi sull\'operazione.',
                req_name: 'Il nome è obbligatorio',
                name_lenth1: 'Il nome deve essere più di 3 caratteri',
                ins_name: 'Nserisci Nome Pre-Distinta',
                place_holder: 'Nome'
            },
            pre_new: {
                filter_applied: 'ATTENZIONE! Non è stato applicato nessun filtro, sei sicuro di voler eseguire?',
                run: 'Esegui',
                go_out: 'Esci',
                create_one: 'Crea nuova Pre-Distinta',
                about_try: 'ATTENZIONE! Stai per processare',
                correct_quantity: ' righe. Assicurati che la quantità sia corretta,altrimenti riprova o contatta l\'assistenz. Premi su Conferma se non hai dubbi sull\'operazione.',
                req_name: 'Il nome è obbligatorio',
                name_lenth1: 'Il nome deve essere più di 3 caratteri',
                ins_name: 'Inserisci Nome Pre-Distinta',
                place_holder: 'Nome',
                used_prod: 'Questi prodotti sono stati già usati in un\'altra pre-distinta',
                ok: 'Ok',
            },
            psbatpdwsi: {
               tit1: 'Esiste una Pre-distinta',
               tit2: 'che ha dei prodotti della stessa categoria e stessa strada, i prodotti saranno aggiunti a quella pre-distinta.',
               value1: 'Continua',
               value2: 'Annulla'
            },
            pw_conf: {
                tit1: 'Ci sono',
                titi2: 'prodotti nella lista da consegnare della stessa categoria e stessa strada che non sono aggiunti, i prodotti saranno aggiunti automaticamente.',
                cat: 'Category',
                bar: 'Barcode',
                recip: 'Recipient',
                ad: 'Address',
                value1: 'Continua',
                value2: 'Annulla'
            },


        }
    },
    pages: {
        dispatch_log: {
            data: 'Data',
            operator: 'Operator',
            status: 'Stato',
        },
        dispatch_view:
            {
            address: 'Indirizzo',
            deliver: 'Consegne',
            time_of_arrival: 'Ora d’arrivo',
            destinatario: 'Destinatario',
            product: 'Prodotto',
            barcode: 'Codice a Barre',
            act_code: 'Codice Atto',
            modals: {
                    set_status: {
                        filter_applied: 'ATTENZIONE! Non è stato applicato nessun filtro, sei sicuro di voler eseguire?',
                        run: 'Esegui',
                        go_out: 'Esci',
                        create_one: 'Crea nuova Pre-Distinta',
                        about_try: 'ATTENZIONE! Stai per processare',
                        correct_quantity: ' righe. Assicurati che la quantità sia corretta,altrimenti riprova o contatta l\'assistenz. Premi su Conferma se non hai dubbi sull\'operazione.',
                        select_status: 'You have to select a status',
                        status_req: 'Status is required'
                    }
            }
        },
        pre_dispatch_log: {
            data: 'Data',
            operator: 'Operator',
            status: 'Stato',
        },
        

    },
    filter_config : {
        products: {
            search: {
                client: 'Cliente',
                client_name: 'Nominativo Cliente',
                postal_distinction: 'Distinita Postale',
                bar_code: 'Codice Barre',
                act_code: 'Codice Atto',
                recipient_name: 'Nominativo Destinatario',
                address: 'Destinatario',
                date_time: 'Data/Ora',
                article_law_name: 'Articolo Legge',
                article_law_date: 'Data Articolo Legge',
                acceptance_date: 'Data Accettazione',
                attempts: 'TENTATIVI',
                sender_name: 'Nominativo MITTENTE',
                sender: 'MITTENTE',
                category: 'Categoria',
                agency: 'Agenzia',
                product_type: 'Product Type',
                note: 'Note'
                    },
            filter : {
                Customer_name: 'Nominativo Cliente',
                client: 'Cliente',
                agency: 'Agenzia',
                postal_distinction: 'Distinita Postale',
                bar_code: 'Codice Barre',
                act_code: 'Codice Atto',
                product_name: 'Nome Prodotto',
                product: 'Prodotto',
                category: 'Categoria',
                recipient_name: 'Nominativo Destinatario',
                address: 'Destinatario',
                recipient_postal_code: 'CAP Destinatario:',
                destination: 'Indirizzo Destinatario:',
                grouping: {
                     value: 'Raggruppamento quantita:',
                     quant_per_cap: 'Quantità per CAP',
                     quant_per_client: 'Quantità per Cliente',
                            },
                street_location: 'Localizzazione strada:',
                date_time: 'Data/Ora:',
                article_law: 'Articolo Legge',
                article_law_date: 'Data Articolo Legge:',
                acceptance_date: 'Data Accettazione:'
                     },
            default_filters: {
                grouping: 'grouping',
                by_cap: 'by_cap',
                fixed: 'fixed',
                null: 'null'
                        }
        },
        pre_dispatch : {
            search : {
                state: {
                    value: 'Stato',
                    in_Palnning: 'In Planning',
                    not_planned: 'Not Planning',
                    planning: 'Planning',
                    paused: 'Paused'
                    },
                name: 'Nominativo',
                postal_distinction: 'Distinita Postale',
                quantity: 'Q.tà'
                    },
            filter : {
                state: {
                    value: 'Stato',
                    in_Palnning: 'In Planning',
                    not_planned: 'Not Planning',
                    planning: 'Planning',
                    paused: 'Paused'
                    },
                name: 'Nominativo',
                postal_distinction: 'Distinita Postale',
                quantity: 'Q.tà',
                date : 'Data :'
                      }
                        },
        dispatch : {
            search: {
                distinguished_name: 'Nominativo Distinta',
                agency: 'Agenzia',
                product_name: 'Nome Prodotto:',
                recipient_name: 'Nominativo Destinatario'
                    },
            filter : {
                client: 'Cliente',
                agency: 'Agenzia',
                distinguished_name: 'Nominativo Distinta',
                note_day: 'Nota giorno',
                internal_notes_for_operators: 'Note interne per operatori',
                postman_note: 'Notifiche postino',
                note_different: 'Note distinta',
                name_attachment: 'Nome allegato',
                status_distinguished: 'Stato Distinta ',
                not_assigned: 'Non assegnato',
                bag_not_prepared: 'Borsa non preparata',
                bill_date: 'Data Distinta',
                codice_barre: 'Bar Code',
                codice_atto: 'Act Code',
                set_code: 'Set Code',
                product: 'Prodotto',
                category: 'Categoria',
                recipient_name: 'Nominativo Destinatario',
                recipient_postal_code: 'CAP Destinatario',
                recipient_address: 'Indirizzo Destinatario'
                    }
                   },
        delivering: {
            search : {
                distinguished_name: 'Nominativo Distinta',
                agency: 'Agenzia',
                product_name: 'Nome Prodotto',
                recipient_name: 'Nominativo Destinatario',
                },
            filter: {
                client: 'Cliente',
                agency: 'Agenzia',
                distinguished_name: 'Nominativo Distinta',
                note_day: 'Nota giorno',
                internal_notes_for_operators: 'Note interne per operatori',
                postman_notifications: 'Notifiche postino',
                note_different : 'Note distinta',
                name_attachment: 'Nome allegato',
                status_distinguished: 'Stato Distinta',
                bag_prepared: 'Borsa preparata',
                bill_date: 'Data Distinta',
                bar_code: 'Codice Barre',
                act_code: 'Codice Atto',
                set_code: 'Set Code',
                product: 'Prodotto',
                category: 'Categoria',
                recipient_name: 'Nominativo Destinatario',
                recipient_postal_code: 'CAP Destinatario',
                recipient_address: 'Indirizzo Destinatario'
                    }
            }
    },
    table_config: {
        simpletable: {
                cities_table: {
                    value: 'Paese',
                    search_placeHolder: 'Cerca Paese'
                    },
                streets_table: {
                    value: 'Strada',
                    search_placeHolder: 'Cerca Strada',
                    action: {
                        value: 'Cambia nome'
                    }
                    },
                postmen_table: {
                    value: 'atteso Postino',
                    search_placeHolder: 'Cerca postino previsto'
                    },
                custom_postmen_table: {
                    value: 'Postmen',
                    search_placeHolder: 'Cerca postino previsto'
                    },
                reviser_table: {
                    value: 'Revisori',
                    search_placeHolder: 'Cerca postino previsto'
                    },
                dispatch: {
                    value: 'Distinte',
                    search_placeHolder: 'Cerca distinte',
                    extra_fields: {
                        value1: '',
                        value2: 'Q.ta'
                    }
                    },
                settings_table: {
                   value: 'Impostazioni',
                   search_placeHolder: 'Cerca'
                    },
                sub_settings_table: {
                    value: 'Map Provider',
                    search_placeHolder: 'Cerca'
                }
        },
        table: {
            products_table: {
                cols: {
                    title1: {
                        value: 'Azioni',
                        action1: 'view',
                        action2: 'book'
                        },
                    title2: 'BARCODE',
                    title3: 'ATTO',
                    title4: {
                        t1: 'PRODOTTO',
                        t2: 'DISTINTA'
                    },
                    title5: 'STATO',
                    title6: {
                        t1: 'DATA/ORA',
                        t2: 'Q.TA',
                        t3: 'TENTATIVI'
                    },
                    title7: {
                        t1: 'CLIENTE',
                        t2: 'MITTENTE',
                        t3: 'DESTINARIO'
                    }
                    }
                    },
            pre_dispatch_table: {
                cols: {
                    title1: {
                        value: 'Azioni',
                        action1: 'more',
                        action2: 'edit',
                        action3: 'print',
                        action4: 'excel_export',
                        action5: 'view',
                        action6: 'pDelete'
                        },
                    title2: 'NOME DISTINTA',
                    title3: 'DISTINTA',
                    title4: {
                        value: 'STATO / ESITO',
                        action: 'view'
                     },
                    title5: 'Q.TA’',
                    title6: 'DATA',
                    title7: {
                        value: 'OPERAZIONE',
                        action1: 'progress',
                        action2: 'pPlay',
                        action3: 'pPause'
                     }
                    },
                collapsed_actions: {
                    Plan: {
                    value: 'Pianifica'
                    },
                    place_in_delivery: {
                        value: 'Metti in Consegna'
                    },
                    add_products: {
                        value: 'Aggiungi Prodotti'
                    },
                    delete: {
                        value: 'Elimina'
                    }
                    }
                },
            dispatch_table: {
                title1: {
                    value: 'Azioni',
                    action1: 'edit',
                    action2: 'print',
                    action3: 'excel_export',
                    action4: 'view',
                    action5: 'pDelete'
                },
                title2: 'Nome',
                title3: '',
                title4: {
                    t1: 'Postino',
                    t2: 'CSPI'
                },
                title5: {
                    t1: 'Stato distinta',
                    t2: 'Distinta',
                    ret1: 'Borsa non preparata',
                    ret2: 'Non assegnato ',
                    ret3: 'Borsa preparata',
                    action: 'view'
                },
                title6: 'Q.tà',
                title7: {
                    t1: 'Data inizio consegna',
                    t2: 'Data creazione'
                },
                title8: 'Nota'
                },
            delivering_table: {
                title1: {
                    value: 'Azioni',
                    action1: 'edit',
                    action2: 'print',
                    action3: 'excel_export',
                    action4: 'view',
                    action5: 'pDelete'
                },
                title2: 'Nome',
                title3: {
                    t1: 'Postino',
                    t2: 'CSPI'
                },
                title4: '',
                title5: {
                    t1: 'Data inizio consegna',
                    t2: 'Data creazione'
                },
                title6: {
                    t1: 'Stato distinta',
                    t2: 'Distinta',
                    ret1: 'Borsa non preparata',
                    ret2: 'Non assegnato ',
                    ret3: 'Borsa preparata',
                    action: 'view'
                },
                title7: 'Q.tà',
                title78: {
                    t1: 'Data inizio consegna',
                    t2: 'Data creazione'
                },
                title9: 'Nota',
                }
            }
        }
    };
