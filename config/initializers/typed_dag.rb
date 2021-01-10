TypedDag::Configuration.set edge_class_name: 'Link',
                            node_class_name: 'Card',
                            types: { link: { from: :links_from,
                                             to: :links_to,
                                             all_from: :all_links_from,
                                             all_to: :all_links_to } }
