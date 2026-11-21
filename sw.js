// منصة قراءتي التفاعلية الذكية - إعداد المهندس أسامة خليل هاشم

const CACHE_NAME = 'qiraati-smart-v68';

const ASSETS_TO_CACHE = [

  './',

  './index.html',

  './manifest.json',

  './audio_data.js',

  './audio_data_unit6.js',

  './curriculum_data.js',

  './css/variables.css',

  './css/layout.css',

  './css/components.css',

  './css/stations.css',

  './css/lessons-prep.css',

  './css/lessons-unit1.css',

  './css/lessons-unit2.css',

  './css/lessons-unit3.css',

  './css/lessons-unit4.css',

  './css/lessons-unit5.css',

  './css/lessons-unit6.css',

  './css/evaluation.css',

  './css/enrichment.css',

  './css/blackboard.css',

  './css/games.css',

  './css/gamification.css',

  './css/teacher-dashboard.css',

  './css/classroom-sync.css',

  './css/classroom-quiz.css',

  './css/interactive-guide.css',

  './js/core/modals.js',

  './js/core/audio.js',

  './js/core/navigation.js',

  './js/core/evaluation.js',

  './js/core/enrichment.js',

  './js/core/blackboard.js',

  './js/core/games.js',

  './js/core/gamification.js',

  './js/core/teacher-dashboard.js',

  './js/core/classroom-sync.js',

  './js/core/classroom-quiz.js',

  './js/core/interactive-guide.js',

  './js/lessons/prep.js',

  './js/lessons/unit1.js',

  './js/lessons/unit2.js',

  './js/lessons/unit3.js',

  './js/lessons/unit4.js',

  './js/lessons/unit5.js',

  './js/lessons/unit6.js',

  './js/app.js',

  './activity_3_items.png',

  './activity_4.png',

  './activity_5.png',

  './activity_5_diff.png',

  './activity_6.png',

  './activity_7_places.png',

  './activity_8_directions.png',

  './activity_b_analysis.png',

  './activity_b_blend.png',

  './activity_b_picnic.png',

  './activity_b_read.png',

  './activity_b_syllables.png',

  './activity_b_vowel_words.png',

  './activity_b_vowels.png',

  './activity_b_words.png',

  './activity_booq_analysis.png',

  './activity_booq_blend.png',

  './activity_booq_read.png',

  './activity_booq_scene.png',

  './activity_booq_syllables.png',

  './activity_booq_trace.png',

  './activity_booq_vowels.png',

  './activity_booq_words.png',

  './activity_d_analysis.png',

  './activity_d_blend.png',

  './activity_d_read.png',

  './activity_d_scene.png',

  './activity_d_syllables.png',

  './activity_d_trace.png',

  './activity_d_vowel_words.png',

  './activity_d_vowels.png',

  './activity_d_words.png',

  './activity_dha_analysis.png',

  './activity_dha_blend.png',

  './activity_dha_order.png',

  './activity_dha_order_para.png',

  './activity_dha_read.png',

  './activity_dha_scene.png',

  './activity_dha_swap.png',

  './activity_dha_syllables.png',

  './activity_dha_trace.png',

  './activity_dha_vowel_words.png',

  './activity_dha_vowels.png',

  './activity_dha_words.png',

  './activity_dhad_analysis.png',

  './activity_dhad_blend.png',

  './activity_dhad_read.png',

  './activity_dhad_scene.png',

  './activity_dhad_syllables.png',

  './activity_dhad_trace.png',

  './activity_dhad_vowel_words.png',

  './activity_dhad_vowels.png',

  './activity_dhad_words.png',

  './activity_dhal_analysis.png',

  './activity_dhal_blend.png',

  './activity_dhal_order.png',

  './activity_dhal_order_para.png',

  './activity_dhal_read.png',

  './activity_dhal_scene.png',

  './activity_dhal_swap.png',

  './activity_dhal_syllables.png',

  './activity_dhal_trace.png',

  './activity_dhal_vowel_words.png',

  './activity_dhal_vowels.png',

  './activity_dhal_words.png',

  './activity_f_scene.png',

  './activity_fatiha_frame.png',

  './activity_ghayn_analysis.png',

  './activity_ghayn_blend.png',

  './activity_ghayn_order.png',

  './activity_ghayn_read.png',

  './activity_ghayn_scene.png',

  './activity_ghayn_swap.png',

  './activity_ghayn_syllables.png',

  './activity_ghayn_trace.png',

  './activity_ghayn_vowel_words.png',

  './activity_ghayn_vowels.png',

  './activity_ghayn_words.png',

  './activity_h_analysis.png',

  './activity_h_blend.png',

  './activity_h_read.png',

  './activity_h_scene.png',

  './activity_h_syllables.png',

  './activity_h_trace.png',

  './activity_h_vowels.png',

  './activity_h_words.png',

  './activity_ha_analysis.png',

  './activity_ha_blend.png',

  './activity_ha_order.png',

  './activity_ha_order_para.png',

  './activity_ha_read.png',

  './activity_ha_scene.png',

  './activity_ha_swap.png',

  './activity_ha_syllables.png',

  './activity_ha_trace.png',

  './activity_ha_vowel_words.png',

  './activity_ha_vowels.png',

  './activity_ha_words.png',

  './activity_hamza_analysis.png',

  './activity_hamza_blend.png',

  './activity_hamza_read.png',

  './activity_hamza_scene.png',

  './activity_hamza_syllables.png',

  './activity_hamza_trace.png',

  './activity_hamza_vowel_words.png',

  './activity_hamza_vowels.png',

  './activity_hamza_words.png',

  './activity_j_analysis.png',

  './activity_j_blend.png',

  './activity_j_read.png',

  './activity_j_scene.png',

  './activity_j_syllables.png',

  './activity_j_trace.png',

  './activity_j_vowels.png',

  './activity_j_words.png',

  './activity_kaf_analysis.png',

  './activity_kaf_blend.png',

  './activity_kaf_read.png',

  './activity_kaf_scene.png',

  './activity_kaf_syllables.png',

  './activity_kaf_trace.png',

  './activity_kaf_vowel_words.png',

  './activity_kaf_vowels.png',

  './activity_kaf_words.png',

  './activity_kha_analysis.png',

  './activity_kha_blend.png',

  './activity_kha_read.png',

  './activity_kha_scene.png',

  './activity_kha_syllables.png',

  './activity_kha_trace.png',

  './activity_kha_vowel_words.png',

  './activity_kha_vowels.png',

  './activity_kha_words.png',

  './activity_lam_analysis.png',

  './activity_lam_compare.png',

  './activity_lam_match.png',

  './activity_lam_nasheed.png',

  './activity_lam_qamariyyah.png',

  './activity_lam_read.png',

  './activity_lam_scene.png',

  './activity_lam_shamsiyyah.png',

  './activity_m_analysis.png',

  './activity_m_blend.png',

  './activity_m_read.png',

  './activity_m_scene.png',

  './activity_m_syllables.png',

  './activity_m_trace.png',

  './activity_m_vowel_words.png',

  './activity_m_vowels.png',

  './activity_m_words.png',

  './activity_marboota_analysis.png',

  './activity_marboota_blend.png',

  './activity_marboota_read.png',

  './activity_marboota_scene.png',

  './activity_marboota_syllables.png',

  './activity_marboota_trace.png',

  './activity_marboota_vowels.png',

  './activity_marboota_words.png',

  './activity_n_analysis.png',

  './activity_n_blend.png',

  './activity_n_read.png',

  './activity_n_scene.png',

  './activity_n_syllables.png',

  './activity_n_trace.png',

  './activity_n_vowel_words.png',

  './activity_n_words.png',

  './activity_nabeel_analysis.png',

  './activity_nabeel_blend.png',

  './activity_nabeel_read.png',

  './activity_nabeel_scene.png',

  './activity_nabeel_syllables.png',

  './activity_nabeel_trace.png',

  './activity_nabeel_vowels.png',

  './activity_nabeel_words.png',

  './activity_nasheed_box.png',

  './activity_nasheed_mama_baba.png',

  './activity_r_analysis.png',

  './activity_r_blend.png',

  './activity_r_read.png',

  './activity_r_scene.png',

  './activity_r_syllables.png',

  './activity_r_trace.png',

  './activity_r_vowel_words.png',

  './activity_r_words.png',

  './activity_reef_analysis.png',

  './activity_reef_blend.png',

  './activity_reef_read.png',

  './activity_reef_scene.png',

  './activity_reef_syllables.png',

  './activity_reef_trace.png',

  './activity_reef_vowels.png',

  './activity_reef_words.png',

  './activity_s_analysis.png',

  './activity_s_blend.png',

  './activity_s_read.png',

  './activity_s_scene.png',

  './activity_s_syllables.png',

  './activity_s_trace.png',

  './activity_s_vowel_words.png',

  './activity_s_words.png',

  './activity_sad_analysis.png',

  './activity_sad_blend.png',

  './activity_sad_read.png',

  './activity_sad_scene.png',

  './activity_sad_syllables.png',

  './activity_sad_tanween_kasr.png',

  './activity_sad_trace.png',

  './activity_sad_vowels.png',

  './activity_sad_words.png',

  './activity_salim_analysis.png',

  './activity_salim_blend.png',

  './activity_salim_read.png',

  './activity_salim_scene.png',

  './activity_salim_syllables.png',

  './activity_salim_trace.png',

  './activity_salim_vowels.png',

  './activity_salim_words.png',

  './activity_sh_analysis.png',

  './activity_sh_blend.png',

  './activity_sh_read.png',

  './activity_sh_scene.png',

  './activity_sh_syllables.png',

  './activity_sh_trace.png',

  './activity_sh_vowels.png',

  './activity_sh_words.png',

  './activity_shaddah_analysis.png',

  './activity_shaddah_blend.png',

  './activity_shaddah_draw.png',

  './activity_shaddah_formation.png',

  './activity_shaddah_nasheed.png',

  './activity_shaddah_pick.png',

  './activity_shaddah_read.png',

  './activity_shaddah_scene.png',

  './activity_shaddah_trace.png',

  './activity_shaddah_words.png',

  './activity_t_analysis.png',

  './activity_t_blend.png',

  './activity_t_read.png',

  './activity_t_scene.png',

  './activity_t_syllables.png',

  './activity_t_trace.png',

  './activity_t_vowel_words.png',

  './activity_t_words.png',

  './activity_ta_analysis.png',

  './activity_ta_blend.png',

  './activity_ta_read.png',

  './activity_ta_scene.png',

  './activity_ta_syllables.png',

  './activity_ta_trace.png',

  './activity_ta_vowels.png',

  './activity_ta_words.png',

  './activity_tanween_dham_analysis.png',

  './activity_tanween_dham_blend.png',

  './activity_tanween_dham_distinguish.png',

  './activity_tanween_dham_read.png',

  './activity_tanween_dham_scene.png',

  './activity_tanween_dham_trace.png',

  './activity_tanween_dham_words.png',

  './activity_tha_analysis.png',

  './activity_tha_blend.png',

  './activity_tha_read.png',

  './activity_tha_scene.png',

  './activity_tha_syllables.png',

  './activity_tha_trace.png',

  './activity_tha_vowel_words.png',

  './activity_tha_vowels.png',

  './activity_tha_words.png',

  './activity_unit2_nasheed_school.png',

  './activity_w_fill.png',

  './activity_w_showcase.png',

  './activity_w_words.png',

  './activity_y_fill.png',

  './activity_y_showcase.png',

  './activity_y_words.png',

  './activity_z_analysis.png',

  './activity_z_blend.png',

  './activity_z_read.png',

  './activity_z_scene.png',

  './activity_z_syllables.png',

  './activity_z_trace.png',

  './activity_z_vowels.png',

  './activity_z_words.png',

  './icons/icon-192.png',

  './icons/icon-512.png',

  './mobile_qr.png',

  './page_100.png',

  './page_101.png',

  './page_102.png',

  './page_103.png',

  './page_104.png',

  './page_105.png',

  './page_106.png',

  './page_107.png',

  './page_108.png',

  './page_109.png',

  './page_110.png',

  './page_111.png',

  './page_112.png',

  './page_113.png',

  './page_114.png',

  './page_115.png',

  './page_116.png',

  './page_117.png',

  './page_118.png',

  './page_119.png',

  './page_120.png',

  './page_121.png',

  './page_122.png',

  './page_123.png',

  './page_124.png',

  './page_125.png',

  './page_126.png',

  './page_127.png',

  './page_128.png',

  './page_129.png',

  './page_17.png',

  './page_18.png',

  './page_19.png',

  './page_20.png',

  './page_21.png',

  './page_22.png',

  './page_23.png',

  './page_24.png',

  './page_25.png',

  './page_26.png',

  './page_27.png',

  './page_28.png',

  './page_29.png',

  './page_30.png',

  './page_31.png',

  './page_32.png',

  './page_33.png',

  './page_34.png',

  './page_35.png',

  './page_36.png',

  './page_37.png',

  './page_38.png',

  './page_39.png',

  './page_40.png',

  './page_41.png',

  './page_42.png',

  './page_43.png',

  './page_44.png',

  './page_45.png',

  './page_46.png',

  './page_47.png',

  './page_48.png',

  './page_49.png',

  './page_50.png',

  './page_51.png',

  './page_52.png',

  './page_53.png',

  './page_54.png',

  './page_55.png',

  './page_56.png',

  './page_57.png',

  './page_58.png',

  './page_59.png',

  './page_60.png',

  './page_61.png',

  './page_62.png',

  './page_63.png',

  './page_64.png',

  './page_65.png',

  './page_66.png',

  './page_67.png',

  './page_68.png',

  './page_69.png',

  './page_70.png',

  './page_71.png',

  './page_72.png',

  './page_73.png',

  './page_74.png',

  './page_75.png',

  './page_76.png',

  './page_77.png',

  './page_78.png',

  './page_79.png',

  './page_80.png',

  './page_81.png',

  './page_82.png',

  './page_83.png',

  './page_84.png',

  './page_85.png',

  './page_86.png',

  './page_87.png',

  './page_88.png',

  './page_89.png',

  './page_90.png',

  './page_91.png',

  './page_92.png',

  './page_93.png',

  './page_94.png',

  './page_95.png',

  './page_96.png',

  './page_97.png',

  './page_98.png',

  './page_99.png',

  './unit1_family_listen.png',

  './unit1_story_grandma.png',

  './unit1_story_kitchen.png',

  './unit1_story_living.png',

  './unit2_school_listen.png',

  './unit2_story_classroom.png',

  './unit2_story_friends.png',

  './unit2_story_yard.png',

  './unit3_story_toys.png',

  './unit3_toys_listen.png',

  './unit4_health_listen.png',

  './unit4_story_health.png',

  './unit5_hobbies_listen.png',

  './unit5_story_hobbies.png',

  './unit6_world_listen.png',

  './audio/act4_full_story.mp3',

  './audio/act4_intro.mp3',

  './audio/act4_pic1_wake.mp3',

  './audio/act4_pic2_breakfast.mp3',

  './audio/act4_pic3_school.mp3',

  './audio/act5_asa.mp3',

  './audio/act5_complete.mp3',

  './audio/act5_dar.mp3',

  './audio/act5_diff_balls_correct.mp3',

  './audio/act5_diff_balls_prompt.mp3',

  './audio/act5_diff_books_correct.mp3',

  './audio/act5_diff_books_prompt.mp3',

  './audio/act5_diff_hens_correct.mp3',

  './audio/act5_diff_hens_prompt.mp3',

  './audio/act5_diff_intro.mp3',

  './audio/act5_diff_ostrich_click.mp3',

  './audio/act5_diff_pencils_correct.mp3',

  './audio/act5_diff_pencils_prompt.mp3',

  './audio/act5_halwa.mp3',

  './audio/act5_mrma.mp3',

  './audio/act5_nar.mp3',

  './audio/act5_pick_alif.mp3',

  './audio/act5_pick_maqsura.mp3',

  './audio/act5_prompt.mp3',

  './audio/act5_wrong.mp3',

  './audio/act7_above.mp3',

  './audio/act7_below.mp3',

  './audio/act7_book_above.mp3',

  './audio/act7_boy_behind.mp3',

  './audio/act7_cat_under.mp3',

  './audio/act7_girl_infront.mp3',

  './audio/act7_intro.mp3',

  './audio/act7_prompt.mp3',

  './audio/act8_car_left.mp3',

  './audio/act8_car_right.mp3',

  './audio/act8_intro.mp3',

  './audio/act8_police.mp3',

  './audio/act8_traffic_light.mp3',

  './audio/blend_intro.mp3',

  './audio/blend_success.mp3',

  './audio/faseeh_blend_dada.mp3',

  './audio/faseeh_blend_dar.mp3',

  './audio/faseeh_blend_door.mp3',

  './audio/faseeh_blend_firas.mp3',

  './audio/faseeh_blend_noor.mp3',

  './audio/faseeh_blend_wardun.mp3',

  './audio/faseeh_encourage_super.mp3',

  './audio/faseeh_model_ana_wa_antum.mp3',

  './audio/faseeh_model_ana_wahdi.mp3',

  './audio/faseeh_model_claps.mp3',

  './audio/faseeh_phoneme_b.mp3',

  './audio/faseeh_phoneme_d.mp3',

  './audio/faseeh_phoneme_f.mp3',

  './audio/faseeh_phoneme_m.mp3',

  './audio/faseeh_phoneme_marboota.mp3',

  './audio/faseeh_phoneme_n.mp3',

  './audio/faseeh_phoneme_r.mp3',

  './audio/faseeh_phoneme_s.mp3',

  './audio/faseeh_phoneme_t.mp3',

  './audio/faseeh_phoneme_tanween.mp3',

  './audio/faseeh_vowels_d.mp3',

  './audio/faseeh_vowels_r.mp3',

  './audio/faseeh_vowels_s.mp3',

  './audio/item_batta.mp3',

  './audio/item_haqiba.mp3',

  './audio/item_jurf.mp3',

  './audio/item_kitab.mp3',

  './audio/item_melaqa.mp3',

  './audio/item_miqas.mp3',

  './audio/item_mistara.mp3',

  './audio/item_qalam.mp3',

  './audio/item_qitar.mp3',

  './audio/item_saa.mp3',

  './audio/item_safira.mp3',

  './audio/item_samaka.mp3',

  './audio/item_shabaka.mp3',

  './audio/item_shatt.mp3',

  './audio/lam_act1_intro.mp3',

  './audio/lam_act2_intro.mp3',

  './audio/lam_act3_intro.mp3',

  './audio/lam_act4_intro.mp3',

  './audio/lam_act5_intro.mp3',

  './audio/lam_completion_congrats.mp3',

  './audio/lam_correct.mp3',

  './audio/lam_encourage_super.mp3',

  './audio/lam_intro.mp3',

  './audio/lam_nasheed_full.mp3',

  './audio/lam_nasheed_verse1.mp3',

  './audio/lam_nasheed_verse2.mp3',

  './audio/lam_nasheed_verse3.mp3',

  './audio/lam_nasheed_verse4.mp3',

  './audio/lam_nasheed_verse5.mp3',

  './audio/lam_phoneme_faseeh.mp3',

  './audio/lam_quiz_intro.mp3',

  './audio/lam_read_full.mp3',

  './audio/lam_read_intro.mp3',

  './audio/lam_read_s1.mp3',

  './audio/lam_read_s2.mp3',

  './audio/lam_read_s3.mp3',

  './audio/lam_read_s4.mp3',

  './audio/lam_scene_story.mp3',

  './audio/lam_sound_qamariyyah.mp3',

  './audio/lam_sound_shamsiyyah.mp3',

  './audio/lam_split_alward.mp3',

  './audio/lam_split_assahaab.mp3',

  './audio/lam_word_addaftar.mp3',

  './audio/lam_word_alard.mp3',

  './audio/lam_word_albattah.mp3',

  './audio/lam_word_alfadaa.mp3',

  './audio/lam_word_alguraab.mp3',

  './audio/lam_word_alguyoom.mp3',

  './audio/lam_word_alhamdu.mp3',

  './audio/lam_word_aliyyun.mp3',

  './audio/lam_word_alkawkab.mp3',

  './audio/lam_word_alkhareef.mp3',

  './audio/lam_word_alkitaab.mp3',

  './audio/lam_word_allahu.mp3',

  './audio/lam_word_almatar.mp3',

  './audio/lam_word_almirreekh.mp3',

  './audio/lam_word_almuallim.mp3',

  './audio/lam_word_alqalam.mp3',

  './audio/lam_word_alqamar.mp3',

  './audio/lam_word_alward.mp3',

  './audio/lam_word_annajm.mp3',

  './audio/lam_word_arrabee.mp3',

  './audio/lam_word_ashams.mp3',

  './audio/lam_word_ashshitaa.mp3',

  './audio/lam_word_assahaab.mp3',

  './audio/lam_word_assamaa.mp3',

  './audio/lam_word_assayf.mp3',

  './audio/lam_word_assayyaarah.mp3',

  './audio/lam_word_athalj.mp3',

  './audio/lam_word_azzahrah.mp3',

  './audio/lam_word_feeha.mp3',

  './audio/lam_word_kawkab.mp3',

  './audio/lam_word_khalaqa.mp3',

  './audio/lam_word_lana.mp3',

  './audio/lam_word_lillah.mp3',

  './audio/lam_word_maadha.mp3',

  './audio/lam_word_matar.mp3',

  './audio/lam_word_najm.mp3',

  './audio/lam_word_qaala.mp3',

  './audio/lam_word_qaalat.mp3',

  './audio/lam_word_qamar.mp3',

  './audio/lam_word_saala.mp3',

  './audio/lam_word_shams.mp3',

  './audio/lam_word_talaameedh.mp3',

  './audio/lam_word_thalj.mp3',

  './audio/lam_word_wannujoom.mp3',

  './audio/lam_word_zaynab.mp3',

  './audio/lam_wrong.mp3',

  './audio/lesson1_intro.mp3',

  './audio/letter_aa.mp3',

  './audio/letter_ayn_salim_analysis_intro.mp3',

  './audio/letter_ayn_salim_blend_intro.mp3',

  './audio/letter_ayn_salim_correct.mp3',

  './audio/letter_ayn_salim_draw_hint.mp3',

  './audio/letter_ayn_salim_encourage_super.mp3',

  './audio/letter_ayn_salim_intro.mp3',

  './audio/letter_ayn_salim_long_aa.mp3',

  './audio/letter_ayn_salim_long_ee.mp3',

  './audio/letter_ayn_salim_long_oo.mp3',

  './audio/letter_ayn_salim_merge_aamir.mp3',

  './audio/letter_ayn_salim_merge_abee.mp3',

  './audio/letter_ayn_salim_merge_alam.mp3',

  './audio/letter_ayn_salim_merge_badee.mp3',

  './audio/letter_ayn_salim_merge_saala.mp3',

  './audio/letter_ayn_salim_merge_salim.mp3',

  './audio/letter_ayn_salim_merge_thalab.mp3',

  './audio/letter_ayn_salim_merge_wasi.mp3',

  './audio/letter_ayn_salim_merge_yazra.mp3',

  './audio/letter_ayn_salim_merge_zarraa.mp3',

  './audio/letter_ayn_salim_phoneme_faseeh.mp3',

  './audio/letter_ayn_salim_quiz_intro.mp3',

  './audio/letter_ayn_salim_read_full.mp3',

  './audio/letter_ayn_salim_read_intro.mp3',

  './audio/letter_ayn_salim_read_s1.mp3',

  './audio/letter_ayn_salim_read_s10.mp3',

  './audio/letter_ayn_salim_read_s2.mp3',

  './audio/letter_ayn_salim_read_s3.mp3',

  './audio/letter_ayn_salim_read_s4.mp3',

  './audio/letter_ayn_salim_read_s5.mp3',

  './audio/letter_ayn_salim_read_s6.mp3',

  './audio/letter_ayn_salim_read_s7.mp3',

  './audio/letter_ayn_salim_read_s8.mp3',

  './audio/letter_ayn_salim_read_s9.mp3',

  './audio/letter_ayn_salim_scene_story.mp3',

  './audio/letter_ayn_salim_short_a.mp3',

  './audio/letter_ayn_salim_short_i.mp3',

  './audio/letter_ayn_salim_short_u.mp3',

  './audio/letter_ayn_salim_sound.mp3',

  './audio/letter_ayn_salim_split_aamir.mp3',

  './audio/letter_ayn_salim_split_abee.mp3',

  './audio/letter_ayn_salim_split_alam.mp3',

  './audio/letter_ayn_salim_split_badee.mp3',

  './audio/letter_ayn_salim_split_fulful.mp3',

  './audio/letter_ayn_salim_split_naanaa.mp3',

  './audio/letter_ayn_salim_split_salim.mp3',

  './audio/letter_ayn_salim_split_thalab.mp3',

  './audio/letter_ayn_salim_split_ward.mp3',

  './audio/letter_ayn_salim_split_wasi.mp3',

  './audio/letter_ayn_salim_split_yazra.mp3',

  './audio/letter_ayn_salim_split_zarraa.mp3',

  './audio/letter_ayn_salim_syl_lua.mp3',

  './audio/letter_ayn_salim_syl_naa.mp3',

  './audio/letter_ayn_salim_syl_thaa.mp3',

  './audio/letter_ayn_salim_syl_zar.mp3',

  './audio/letter_ayn_salim_tanween_dham.mp3',

  './audio/letter_ayn_salim_tanween_fath.mp3',

  './audio/letter_ayn_salim_tanween_kasr.mp3',

  './audio/letter_ayn_salim_vowels_station.mp3',

  './audio/letter_ayn_salim_word_aalim.mp3',

  './audio/letter_ayn_salim_word_aaliya.mp3',

  './audio/letter_ayn_salim_word_aamir.mp3',

  './audio/letter_ayn_salim_word_abee.mp3',

  './audio/letter_ayn_salim_word_abi.mp3',

  './audio/letter_ayn_salim_word_alam.mp3',

  './audio/letter_ayn_salim_word_ana.mp3',

  './audio/letter_ayn_salim_word_badee.mp3',

  './audio/letter_ayn_salim_word_bustani.mp3',

  './audio/letter_ayn_salim_word_eadaan.mp3',

  './audio/letter_ayn_salim_word_fulful.mp3',

  './audio/letter_ayn_salim_word_inab.mp3',

  './audio/letter_ayn_salim_word_iraq.mp3',

  './audio/letter_ayn_salim_word_isba.mp3',

  './audio/letter_ayn_salim_word_izaam.mp3',

  './audio/letter_ayn_salim_word_lubah.mp3',

  './audio/letter_ayn_salim_word_maan.mp3',

  './audio/letter_ayn_salim_word_marfooa.mp3',

  './audio/letter_ayn_salim_word_mizhyaa.mp3',

  './audio/letter_ayn_salim_word_naama.mp3',

  './audio/letter_ayn_salim_word_naanaa.mp3',

  './audio/letter_ayn_salim_word_nab.mp3',

  './audio/letter_ayn_salim_word_nalab.mp3',

  './audio/letter_ayn_salim_word_ood.mp3',

  './audio/letter_ayn_salim_word_rabee.mp3',

  './audio/letter_ayn_salim_word_salim.mp3',

  './audio/letter_ayn_salim_word_shaari.mp3',

  './audio/letter_ayn_salim_word_shulah.mp3',

  './audio/letter_ayn_salim_word_thalab.mp3',

  './audio/letter_ayn_salim_word_usfoor.mp3',

  './audio/letter_ayn_salim_word_ward.mp3',

  './audio/letter_ayn_salim_word_wasi.mp3',

  './audio/letter_ayn_salim_word_yaqool.mp3',

  './audio/letter_ayn_salim_word_yazra.mp3',

  './audio/letter_ayn_salim_word_zarraa.mp3',

  './audio/letter_ayn_salim_word_zhiraa.mp3',

  './audio/letter_ayn_salim_words_intro.mp3',

  './audio/letter_ayn_salim_wrong.mp3',

  './audio/letter_b_analysis_intro.mp3',

  './audio/letter_b_bab.mp3',

  './audio/letter_b_baqara.mp3',

  './audio/letter_b_basal.mp3',

  './audio/letter_b_bisat.mp3',

  './audio/letter_b_bittikh.mp3',

  './audio/letter_b_buq.mp3',

  './audio/letter_b_burtuqal.mp3',

  './audio/letter_b_draw_hint.mp3',

  './audio/letter_b_halib.mp3',

  './audio/letter_b_intro.mp3',

  './audio/letter_b_jubn_syllable.mp3',

  './audio/letter_b_khubz.mp3',

  './audio/letter_b_long_a.mp3',

  './audio/letter_b_long_i.mp3',

  './audio/letter_b_long_u.mp3',

  './audio/letter_b_merge_bab.mp3',

  './audio/letter_b_merge_baba.mp3',

  './audio/letter_b_merge_babi.mp3',

  './audio/letter_b_merge_intro.mp3',

  './audio/letter_b_picnic_full.mp3',

  './audio/letter_b_rabi.mp3',

  './audio/letter_b_read_all.mp3',

  './audio/letter_b_shibl_syllable.mp3',

  './audio/letter_b_short_a.mp3',

  './audio/letter_b_short_i.mp3',

  './audio/letter_b_short_u.mp3',

  './audio/letter_b_sound.mp3',

  './audio/letter_b_split_bab.mp3',

  './audio/letter_b_split_baba.mp3',

  './audio/letter_b_split_babi.mp3',

  './audio/letter_b_tabl_syllable.mp3',

  './audio/letter_b_vowels_intro.mp3',

  './audio/letter_d_analysis_intro.mp3',

  './audio/letter_d_asad.mp3',

  './audio/letter_d_badr_syllable.mp3',

  './audio/letter_d_dalla.mp3',

  './audio/letter_d_dar.mp3',

  './audio/letter_d_dar_vowel.mp3',

  './audio/letter_d_daraj_vowel.mp3',

  './audio/letter_d_deek.mp3',

  './audio/letter_d_deek_vowel.mp3',

  './audio/letter_d_dibs_vowel.mp3',

  './audio/letter_d_dirham.mp3',

  './audio/letter_d_dood.mp3',

  './audio/letter_d_dood_vowel.mp3',

  './audio/letter_d_draw_hint.mp3',

  './audio/letter_d_dub.mp3',

  './audio/letter_d_dumya_vowel.mp3',

  './audio/letter_d_hudhud_syllable.mp3',

  './audio/letter_d_intro.mp3',

  './audio/letter_d_long_a.mp3',

  './audio/letter_d_long_i.mp3',

  './audio/letter_d_long_u.mp3',

  './audio/letter_d_merge_baba.mp3',

  './audio/letter_d_merge_dada.mp3',

  './audio/letter_d_merge_dama.mp3',

  './audio/letter_d_merge_intro.mp3',

  './audio/letter_d_merge_mama.mp3',

  './audio/letter_d_qidr_syllable.mp3',

  './audio/letter_d_qird.mp3',

  './audio/letter_d_read_all.mp3',

  './audio/letter_d_read_baba.mp3',

  './audio/letter_d_read_dada.mp3',

  './audio/letter_d_read_mama.mp3',

  './audio/letter_d_scene_story.mp3',

  './audio/letter_d_short_a.mp3',

  './audio/letter_d_short_i.mp3',

  './audio/letter_d_short_u.mp3',

  './audio/letter_d_sound.mp3',

  './audio/letter_d_split_dada.mp3',

  './audio/letter_d_split_dood.mp3',

  './audio/letter_d_syllables_intro.mp3',

  './audio/letter_d_vowels_intro.mp3',

  './audio/letter_da.mp3',

  './audio/letter_dha_act1_intro.mp3',

  './audio/letter_dha_act2_intro.mp3',

  './audio/letter_dha_act3_intro.mp3',

  './audio/letter_dha_act4_intro.mp3',

  './audio/letter_dha_act5_intro.mp3',

  './audio/letter_dha_act6_intro.mp3',

  './audio/letter_dha_act7_intro.mp3',

  './audio/letter_dha_act8_intro.mp3',

  './audio/letter_dha_act9_intro.mp3',

  './audio/letter_dha_correct.mp3',

  './audio/letter_dha_encourage_super.mp3',

  './audio/letter_dha_intro.mp3',

  './audio/letter_dha_long_aa.mp3',

  './audio/letter_dha_long_ee.mp3',

  './audio/letter_dha_long_oo.mp3',

  './audio/letter_dha_merge_haafiz.mp3',

  './audio/letter_dha_merge_mahfazah.mp3',

  './audio/letter_dha_merge_zaafir.mp3',

  './audio/letter_dha_order_para_full.mp3',

  './audio/letter_dha_order_para_s1.mp3',

  './audio/letter_dha_order_para_s2.mp3',

  './audio/letter_dha_order_sentence_full.mp3',

  './audio/letter_dha_phoneme_faseeh.mp3',

  './audio/letter_dha_quiz_intro.mp3',

  './audio/letter_dha_read_intro.mp3',

  './audio/letter_dha_read_p125_full.mp3',

  './audio/letter_dha_read_p125_s1.mp3',

  './audio/letter_dha_read_p125_s2.mp3',

  './audio/letter_dha_read_p125_s3.mp3',

  './audio/letter_dha_scene_story.mp3',

  './audio/letter_dha_short_a.mp3',

  './audio/letter_dha_short_i.mp3',

  './audio/letter_dha_short_u.mp3',

  './audio/letter_dha_sound.mp3',

  './audio/letter_dha_split_hazeerah.mp3',

  './audio/letter_dha_split_mahfazah.mp3',

  './audio/letter_dha_split_naazoor.mp3',

  './audio/letter_dha_split_nazzaarah.mp3',

  './audio/letter_dha_story_mahfooz_full.mp3',

  './audio/letter_dha_story_mahfooz_s1.mp3',

  './audio/letter_dha_story_mahfooz_s2.mp3',

  './audio/letter_dha_story_mahfooz_s3.mp3',

  './audio/letter_dha_story_mahfooz_s4.mp3',

  './audio/letter_dha_story_mahfooz_s5.mp3',

  './audio/letter_dha_syl_adh.mp3',

  './audio/letter_dha_syl_adh_i.mp3',

  './audio/letter_dha_syl_adh_u.mp3',

  './audio/letter_dha_syl_azm.mp3',

  './audio/letter_dha_syl_mah.mp3',

  './audio/letter_dha_syl_yadh.mp3',

  './audio/letter_dha_word_ala.mp3',

  './audio/letter_dha_word_aleemaan.mp3',

  './audio/letter_dha_word_annazaafatu.mp3',

  './audio/letter_dha_word_aynayh.mp3',

  './audio/letter_dha_word_azfaar.mp3',

  './audio/letter_dha_word_azfur.mp3',

  './audio/letter_dha_word_azm.mp3',

  './audio/letter_dha_word_baakiran.mp3',

  './audio/letter_dha_word_bihi.mp3',

  './audio/letter_dha_word_biwudooh.mp3',

  './audio/letter_dha_word_duroosaka.mp3',

  './audio/letter_dha_word_ezaam.mp3',

  './audio/letter_dha_word_falaa.mp3',

  './audio/letter_dha_word_fee.mp3',

  './audio/letter_dha_word_haafiz.mp3',

  './audio/letter_dha_word_haasoobahu.mp3',

  './audio/letter_dha_word_haseerah.mp3',

  './audio/letter_dha_word_hayawaanaat.mp3',

  './audio/letter_dha_word_hazeerah.mp3',

  './audio/letter_dha_word_ihfaz.mp3',

  './audio/letter_dha_word_indahaa.mp3',

  './audio/letter_dha_word_jameel.mp3',

  './audio/letter_dha_word_katheeran.mp3',

  './audio/letter_dha_word_kulla.mp3',

  './audio/letter_dha_word_likay.mp3',

  './audio/letter_dha_word_lisadeeqihi.mp3',

  './audio/letter_dha_word_madrasatika.mp3',

  './audio/letter_dha_word_mahfazah.mp3',

  './audio/letter_dha_word_mahfooz.mp3',

  './audio/letter_dha_word_mina.mp3',

  './audio/letter_dha_word_muntazar.mp3',

  './audio/letter_dha_word_mutanawwiah.mp3',

  './audio/letter_dha_word_naatoor.mp3',

  './audio/letter_dha_word_naazoor.mp3',

  './audio/letter_dha_word_nasheet.mp3',

  './audio/letter_dha_word_nazaafati.mp3',

  './audio/letter_dha_word_nazzaarah.mp3',

  './audio/letter_dha_word_nizaam.mp3',

  './audio/letter_dha_word_qitt.mp3',

  './audio/letter_dha_word_sihhati.mp3',

  './audio/letter_dha_word_sinjaab.mp3',

  './audio/letter_dha_word_tibbiyyah.mp3',

  './audio/letter_dha_word_tilmeedh.mp3',

  './audio/letter_dha_word_turabbee.mp3',

  './audio/letter_dha_word_wahaafiz.mp3',

  './audio/letter_dha_word_yada.mp3',

  './audio/letter_dha_word_yalabu.mp3',

  './audio/letter_dha_word_yanaamu.mp3',

  './audio/letter_dha_word_yaqoolu.mp3',

  './audio/letter_dha_word_yara.mp3',

  './audio/letter_dha_word_yastayqizu.mp3',

  './audio/letter_dha_word_yawm.mp3',

  './audio/letter_dha_word_yuhaafizu.mp3',

  './audio/letter_dha_word_yuhibbu.mp3',

  './audio/letter_dha_word_zaafir.mp3',

  './audio/letter_dha_word_zaby.mp3',

  './audio/letter_dha_word_zafaar.mp3',

  './audio/letter_dha_word_zafar.mp3',

  './audio/letter_dha_word_zalama.mp3',

  './audio/letter_dha_word_zarf.mp3',

  './audio/letter_dha_word_zibaa.mp3',

  './audio/letter_dha_word_zill.mp3',

  './audio/letter_dha_wrong.mp3',

  './audio/letter_dhad_analysis_intro.mp3',

  './audio/letter_dhad_blend_intro.mp3',

  './audio/letter_dhad_correct.mp3',

  './audio/letter_dhad_draw_hint.mp3',

  './audio/letter_dhad_encourage_super.mp3',

  './audio/letter_dhad_intro.mp3',

  './audio/letter_dhad_long_aa.mp3',

  './audio/letter_dhad_long_ee.mp3',

  './audio/letter_dhad_long_oo.mp3',

  './audio/letter_dhad_merge_adalaat.mp3',

  './audio/letter_dhad_merge_daabit.mp3',

  './audio/letter_dhad_merge_hawd.mp3',

  './audio/letter_dhad_merge_radeea.mp3',

  './audio/letter_dhad_merge_riyaad.mp3',

  './audio/letter_dhad_phoneme_faseeh.mp3',

  './audio/letter_dhad_quiz_intro.mp3',

  './audio/letter_dhad_read_b1.mp3',

  './audio/letter_dhad_read_b2.mp3',

  './audio/letter_dhad_read_b3.mp3',

  './audio/letter_dhad_read_book_full.mp3',

  './audio/letter_dhad_read_h1.mp3',

  './audio/letter_dhad_read_h2.mp3',

  './audio/letter_dhad_read_h3.mp3',

  './audio/letter_dhad_read_h4.mp3',

  './audio/letter_dhad_read_h5.mp3',

  './audio/letter_dhad_read_hawd_full.mp3',

  './audio/letter_dhad_read_intro.mp3',

  './audio/letter_dhad_scene_story.mp3',

  './audio/letter_dhad_shape_first.mp3',

  './audio/letter_dhad_shape_last_conn.mp3',

  './audio/letter_dhad_shape_last_sep.mp3',

  './audio/letter_dhad_shape_mid.mp3',

  './audio/letter_dhad_shapes_intro.mp3',

  './audio/letter_dhad_short_a.mp3',

  './audio/letter_dhad_short_i.mp3',

  './audio/letter_dhad_short_u.mp3',

  './audio/letter_dhad_sound.mp3',

  './audio/letter_dhad_split_adalaat.mp3',

  './audio/letter_dhad_split_daabit.mp3',

  './audio/letter_dhad_split_duha.mp3',

  './audio/letter_dhad_split_hawd.mp3',

  './audio/letter_dhad_split_khudaar.mp3',

  './audio/letter_dhad_split_naahid.mp3',

  './audio/letter_dhad_split_radeea.mp3',

  './audio/letter_dhad_split_riyaad.mp3',

  './audio/letter_dhad_syl_ad.mp3',

  './audio/letter_dhad_syl_intro.mp3',

  './audio/letter_dhad_syl_mid.mp3',

  './audio/letter_dhad_syl_rad.mp3',

  './audio/letter_dhad_syl_yad.mp3',

  './audio/letter_dhad_vowels_station.mp3',

  './audio/letter_dhad_word_adalaat.mp3',

  './audio/letter_dhad_word_ajooz.mp3',

  './audio/letter_dhad_word_ard.mp3',

  './audio/letter_dhad_word_bayd.mp3',

  './audio/letter_dhad_word_daabit.mp3',

  './audio/letter_dhad_word_dafeerah.mp3',

  './audio/letter_dhad_word_difda.mp3',

  './audio/letter_dhad_word_dirsun.mp3',

  './audio/letter_dhad_word_diyaa.mp3',

  './audio/letter_dhad_word_duha.mp3',

  './audio/letter_dhad_word_duyoof.mp3',

  './audio/letter_dhad_word_hawd.mp3',

  './audio/letter_dhad_word_khudaar.mp3',

  './audio/letter_dhad_word_mareed.mp3',

  './audio/letter_dhad_word_midrab.mp3',

  './audio/letter_dhad_word_mumarriz.mp3',

  './audio/letter_dhad_word_mustashfa.mp3',

  './audio/letter_dhad_word_naahid.mp3',

  './audio/letter_dhad_word_nafrah.mp3',

  './audio/letter_dhad_word_nahnu.mp3',

  './audio/letter_dhad_word_nalabu.mp3',

  './audio/letter_dhad_word_narkud.mp3',

  './audio/letter_dhad_word_qala.mp3',

  './audio/letter_dhad_word_radeea.mp3',

  './audio/letter_dhad_word_riyaad.mp3',

  './audio/letter_dhad_word_saadiq.mp3',

  './audio/letter_dhad_word_sibahah.mp3',

  './audio/letter_dhad_word_ta-tanee.mp3',

  './audio/letter_dhad_word_tahmilu.mp3',

  './audio/letter_dhad_word_tiflan.mp3',

  './audio/letter_dhad_word_wudoo.mp3',

  './audio/letter_dhad_word_yad-hak.mp3',

  './audio/letter_dhad_word_yadrib.mp3',

  './audio/letter_dhad_word_yardau.mp3',

  './audio/letter_dhad_word_yasbahu.mp3',

  './audio/letter_dhad_words_intro.mp3',

  './audio/letter_dhad_wrong.mp3',

  './audio/letter_dhal_act1_intro.mp3',

  './audio/letter_dhal_act2_intro.mp3',

  './audio/letter_dhal_act3_intro.mp3',

  './audio/letter_dhal_act4_intro.mp3',

  './audio/letter_dhal_act5_intro.mp3',

  './audio/letter_dhal_act6_intro.mp3',

  './audio/letter_dhal_act7_intro.mp3',

  './audio/letter_dhal_act8_intro.mp3',

  './audio/letter_dhal_act9_intro.mp3',

  './audio/letter_dhal_correct.mp3',

  './audio/letter_dhal_encourage_super.mp3',

  './audio/letter_dhal_intro.mp3',

  './audio/letter_dhal_long_aa.mp3',

  './audio/letter_dhal_long_ee.mp3',

  './audio/letter_dhal_long_oo.mp3',

  './audio/letter_dhal_merge_badhala.mp3',

  './audio/letter_dhal_merge_badhara.mp3',

  './audio/letter_dhal_merge_muaadh.mp3',

  './audio/letter_dhal_merge_ustaadh.mp3',

  './audio/letter_dhal_order_para_full.mp3',

  './audio/letter_dhal_order_para_s1.mp3',

  './audio/letter_dhal_order_para_s2.mp3',

  './audio/letter_dhal_order_sentence_full.mp3',

  './audio/letter_dhal_phoneme_faseeh.mp3',

  './audio/letter_dhal_quiz_intro.mp3',

  './audio/letter_dhal_read_intro.mp3',

  './audio/letter_dhal_read_p121_full.mp3',

  './audio/letter_dhal_read_p121_s1.mp3',

  './audio/letter_dhal_read_p121_s2.mp3',

  './audio/letter_dhal_scene_story.mp3',

  './audio/letter_dhal_short_a.mp3',

  './audio/letter_dhal_short_i.mp3',

  './audio/letter_dhal_short_u.mp3',

  './audio/letter_dhal_sound.mp3',

  './audio/letter_dhal_split_budhoor.mp3',

  './audio/letter_dhal_split_tilmeedh.mp3',

  './audio/letter_dhal_split_yudhee.mp3',

  './audio/letter_dhal_story_ustaadh_full.mp3',

  './audio/letter_dhal_story_ustaadh_s1.mp3',

  './audio/letter_dhal_story_ustaadh_s2.mp3',

  './audio/letter_dhal_story_ustaadh_s3.mp3',

  './audio/letter_dhal_story_ustaadh_s4.mp3',

  './audio/letter_dhal_story_ustaadh_s5.mp3',

  './audio/letter_dhal_syl_jadh.mp3',

  './audio/letter_dhal_syl_midh.mp3',

  './audio/letter_dhal_syl_udh.mp3',

  './audio/letter_dhal_word_adhooq.mp3',

  './audio/letter_dhal_word_alasal.mp3',

  './audio/letter_dhal_word_badhala.mp3',

  './audio/letter_dhal_word_badhara.mp3',

  './audio/letter_dhal_word_budhoor.mp3',

  './audio/letter_dhal_word_budhooran.mp3',

  './audio/letter_dhal_word_budoor.mp3',

  './audio/letter_dhal_word_dhakiyyah.mp3',

  './audio/letter_dhal_word_dhaqan.mp3',

  './audio/letter_dhal_word_dhayl.mp3',

  './audio/letter_dhal_word_dhib.mp3',

  './audio/letter_dhal_word_dhiraa.mp3',

  './audio/letter_dhal_word_dhubaabah.mp3',

  './audio/letter_dhal_word_dhura.mp3',

  './audio/letter_dhal_word_duroosaha.mp3',

  './audio/letter_dhal_word_fayarsumoon.mp3',

  './audio/letter_dhal_word_haadhiq.mp3',

  './audio/letter_dhal_word_haariq.mp3',

  './audio/letter_dhal_word_hidhaa.mp3',

  './audio/letter_dhal_word_iqra.mp3',

  './audio/letter_dhal_word_jadhr.mp3',

  './audio/letter_dhal_word_judhooan.mp3',

  './audio/letter_dhal_word_judhooran.mp3',

  './audio/letter_dhal_word_ladheedh.mp3',

  './audio/letter_dhal_word_ladheedhan.mp3',

  './audio/letter_dhal_word_maa.mp3',

  './audio/letter_dhal_word_maahir.mp3',

  './audio/letter_dhal_word_madrasataha.mp3',

  './audio/letter_dhal_word_midhyaa.mp3',

  './audio/letter_dhal_word_muaadh.mp3',

  './audio/letter_dhal_word_muallim.mp3',

  './audio/letter_dhal_word_mudhee.mp3',

  './audio/letter_dhal_word_mukhtalifah.mp3',

  './audio/letter_dhal_word_mundhir.mp3',

  './audio/letter_dhal_word_nabaataat.mp3',

  './audio/letter_dhal_word_nasheet.mp3',

  './audio/letter_dhal_word_qadeer.mp3',

  './audio/letter_dhal_word_qunfudh.mp3',

  './audio/letter_dhal_word_sihhiyyan.mp3',

  './audio/letter_dhal_word_taaman.mp3',

  './audio/letter_dhal_word_tabbaakh.mp3',

  './audio/letter_dhal_word_talaameedhih.mp3',

  './audio/letter_dhal_word_tilmeedh.mp3',

  './audio/letter_dhal_word_tilmeedhah.mp3',

  './audio/letter_dhal_word_tuhibbu.mp3',

  './audio/letter_dhal_word_udhun.mp3',

  './audio/letter_dhal_word_ustaadh.mp3',

  './audio/letter_dhal_word_yabee.mp3',

  './audio/letter_dhal_word_yarsumu.mp3',

  './audio/letter_dhal_word_yatho.mp3',

  './audio/letter_dhal_word_yudhee.mp3',

  './audio/letter_dhal_wrong.mp3',

  './audio/letter_f_analysis_intro.mp3',

  './audio/letter_f_difda_syllable.mp3',

  './audio/letter_f_draw_hint.mp3',

  './audio/letter_f_fahd_vowel.mp3',

  './audio/letter_f_fam.mp3',

  './audio/letter_f_fanous.mp3',

  './audio/letter_f_fanous_vowel.mp3',

  './audio/letter_f_farasha.mp3',

  './audio/letter_f_feel.mp3',

  './audio/letter_f_feel_vowel.mp3',

  './audio/letter_f_fijl.mp3',

  './audio/letter_f_finjan_vowel.mp3',

  './audio/letter_f_furn_vowel.mp3',

  './audio/letter_f_fustan.mp3',

  './audio/letter_f_hafla_syllable.mp3',

  './audio/letter_f_intro.mp3',

  './audio/letter_f_long_a.mp3',

  './audio/letter_f_long_i.mp3',

  './audio/letter_f_long_u.mp3',

  './audio/letter_f_merge_baba.mp3',

  './audio/letter_f_merge_badi.mp3',

  './audio/letter_f_merge_fadi.mp3',

  './audio/letter_f_merge_intro.mp3',

  './audio/letter_f_merge_mama.mp3',

  './audio/letter_f_miftah.mp3',

  './audio/letter_f_nafoora.mp3',

  './audio/letter_f_osfoor_vowel.mp3',

  './audio/letter_f_read_all.mp3',

  './audio/letter_f_read_fadi.mp3',

  './audio/letter_f_read_fam.mp3',

  './audio/letter_f_read_mufeed.mp3',

  './audio/letter_f_reef_analysis_intro.mp3',

  './audio/letter_f_reef_blend_intro.mp3',

  './audio/letter_f_reef_correct.mp3',

  './audio/letter_f_reef_draw_hint.mp3',

  './audio/letter_f_reef_encourage_super.mp3',

  './audio/letter_f_reef_intro.mp3',

  './audio/letter_f_reef_long_aa.mp3',

  './audio/letter_f_reef_long_ee.mp3',

  './audio/letter_f_reef_long_oo.mp3',

  './audio/letter_f_reef_merge_baqar.mp3',

  './audio/letter_f_reef_merge_farooq.mp3',

  './audio/letter_f_reef_merge_manaf.mp3',

  './audio/letter_f_reef_merge_mufeed.mp3',

  './audio/letter_f_reef_merge_reef.mp3',

  './audio/letter_f_reef_phoneme_faseeh.mp3',

  './audio/letter_f_reef_quiz_intro.mp3',

  './audio/letter_f_reef_read_full.mp3',

  './audio/letter_f_reef_read_intro.mp3',

  './audio/letter_f_reef_read_s1.mp3',

  './audio/letter_f_reef_read_s2.mp3',

  './audio/letter_f_reef_read_s3.mp3',

  './audio/letter_f_reef_read_s4.mp3',

  './audio/letter_f_reef_read_s5.mp3',

  './audio/letter_f_reef_scene_story.mp3',

  './audio/letter_f_reef_short_a.mp3',

  './audio/letter_f_reef_short_i.mp3',

  './audio/letter_f_reef_short_u.mp3',

  './audio/letter_f_reef_sound.mp3',

  './audio/letter_f_reef_split_baqar.mp3',

  './audio/letter_f_reef_split_farooq.mp3',

  './audio/letter_f_reef_split_manaf.mp3',

  './audio/letter_f_reef_split_mufeed.mp3',

  './audio/letter_f_reef_split_reef.mp3',

  './audio/letter_f_reef_syl_dif.mp3',

  './audio/letter_f_reef_syl_haf.mp3',

  './audio/letter_f_reef_syl_raf.mp3',

  './audio/letter_f_reef_syl_tif.mp3',

  './audio/letter_f_reef_vowels_station.mp3',

  './audio/letter_f_reef_word_baqar.mp3',

  './audio/letter_f_reef_word_farasha.mp3',

  './audio/letter_f_reef_word_farooq.mp3',

  './audio/letter_f_reef_word_feel.mp3',

  './audio/letter_f_reef_word_fustan.mp3',

  './audio/letter_f_reef_word_kharoof.mp3',

  './audio/letter_f_reef_word_manaf.mp3',

  './audio/letter_f_reef_word_miftah.mp3',

  './audio/letter_f_reef_word_mufeed.mp3',

  './audio/letter_f_reef_word_rafeeq.mp3',

  './audio/letter_f_reef_word_reef.mp3',

  './audio/letter_f_reef_word_wazz.mp3',

  './audio/letter_f_reef_wrong.mp3',

  './audio/letter_f_scene_story.mp3',

  './audio/letter_f_short_a.mp3',

  './audio/letter_f_short_i.mp3',

  './audio/letter_f_short_u.mp3',

  './audio/letter_f_sound.mp3',

  './audio/letter_f_split_dufoof.mp3',

  './audio/letter_f_split_fam.mp3',

  './audio/letter_f_split_mufeed.mp3',

  './audio/letter_f_syllables_intro.mp3',

  './audio/letter_f_tifl_syllable.mp3',

  './audio/letter_f_vowels_intro.mp3',

  './audio/letter_ghayn_act1_intro.mp3',

  './audio/letter_ghayn_act2_intro.mp3',

  './audio/letter_ghayn_act3_intro.mp3',

  './audio/letter_ghayn_act4_intro.mp3',

  './audio/letter_ghayn_act5_intro.mp3',

  './audio/letter_ghayn_act6_intro.mp3',

  './audio/letter_ghayn_act7_intro.mp3',

  './audio/letter_ghayn_act8_intro.mp3',

  './audio/letter_ghayn_act9_intro.mp3',

  './audio/letter_ghayn_correct.mp3',

  './audio/letter_ghayn_encourage_super.mp3',

  './audio/letter_ghayn_intro.mp3',

  './audio/letter_ghayn_long_aa.mp3',

  './audio/letter_ghayn_long_ee.mp3',

  './audio/letter_ghayn_long_oo.mp3',

  './audio/letter_ghayn_merge_ghaabah.mp3',

  './audio/letter_ghayn_merge_ghaalib.mp3',

  './audio/letter_ghayn_merge_ghaamidh.mp3',

  './audio/letter_ghayn_merge_taghleef.mp3',

  './audio/letter_ghayn_phoneme_faseeh.mp3',

  './audio/letter_ghayn_quiz_intro.mp3',

  './audio/letter_ghayn_read_intro.mp3',

  './audio/letter_ghayn_read_p113_full.mp3',

  './audio/letter_ghayn_read_p113_s1.mp3',

  './audio/letter_ghayn_read_p113_s2.mp3',

  './audio/letter_ghayn_read_p113_s3.mp3',

  './audio/letter_ghayn_read_p113_s4.mp3',

  './audio/letter_ghayn_scene_story.mp3',

  './audio/letter_ghayn_short_a.mp3',

  './audio/letter_ghayn_short_i.mp3',

  './audio/letter_ghayn_short_u.mp3',

  './audio/letter_ghayn_sound.mp3',

  './audio/letter_ghayn_split_ghawwaasah.mp3',

  './audio/letter_ghayn_split_sabbaagh.mp3',

  './audio/letter_ghayn_split_taghreed.mp3',

  './audio/letter_ghayn_story_asbaagh_full.mp3',

  './audio/letter_ghayn_story_asbaagh_s1.mp3',

  './audio/letter_ghayn_story_asbaagh_s2.mp3',

  './audio/letter_ghayn_story_asbaagh_s3.mp3',

  './audio/letter_ghayn_story_gazelle_full.mp3',

  './audio/letter_ghayn_story_gazelle_s1.mp3',

  './audio/letter_ghayn_story_gazelle_s2.mp3',

  './audio/letter_ghayn_story_gazelle_s3.mp3',

  './audio/letter_ghayn_story_gazelle_s4.mp3',

  './audio/letter_ghayn_story_ghuraab_full.mp3',

  './audio/letter_ghayn_story_ghuraab_s1.mp3',

  './audio/letter_ghayn_story_ghuraab_s2.mp3',

  './audio/letter_ghayn_story_ghuraab_s3.mp3',

  './audio/letter_ghayn_story_ghuraab_s4.mp3',

  './audio/letter_ghayn_syl_agh.mp3',

  './audio/letter_ghayn_syl_migh.mp3',

  './audio/letter_ghayn_unit6_story.mp3',

  './audio/letter_ghayn_word_aghnaam.mp3',

  './audio/letter_ghayn_word_alhamdu.mp3',

  './audio/letter_ghayn_word_asbaagh.mp3',

  './audio/letter_ghayn_word_atshaan.mp3',

  './audio/letter_ghayn_word_babbaghaa.mp3',

  './audio/letter_ghayn_word_dimaagh.mp3',

  './audio/letter_ghayn_word_faqeer.mp3',

  './audio/letter_ghayn_word_fariha.mp3',

  './audio/letter_ghayn_word_ghaabah.mp3',

  './audio/letter_ghayn_word_ghaalib.mp3',

  './audio/letter_ghayn_word_ghaamidh.mp3',

  './audio/letter_ghayn_word_ghareeb.mp3',

  './audio/letter_ghayn_word_ghassaal.mp3',

  './audio/letter_ghayn_word_ghassaalah.mp3',

  './audio/letter_ghayn_word_ghassaan.mp3',

  './audio/letter_ghayn_word_ghawwaasah.mp3',

  './audio/letter_ghayn_word_ghazaal.mp3',

  './audio/letter_ghayn_word_ghidhaa.mp3',

  './audio/letter_ghayn_word_ghitaa.mp3',

  './audio/letter_ghayn_word_ghoorilla.mp3',

  './audio/letter_ghayn_word_ghuraab.mp3',

  './audio/letter_ghayn_word_ghusn.mp3',

  './audio/letter_ghayn_word_hasaat.mp3',

  './audio/letter_ghayn_word_hishaam.mp3',

  './audio/letter_ghayn_word_irtafa_a.mp3',

  './audio/letter_ghayn_word_jarrah.mp3',

  './audio/letter_ghayn_word_maksoorah.mp3',

  './audio/letter_ghayn_word_maysmoon.mp3',

  './audio/letter_ghayn_word_mighsalah.mp3',

  './audio/letter_ghayn_word_mighzal.mp3',

  './audio/letter_ghayn_word_qaddama.mp3',

  './audio/letter_ghayn_word_qareeb.mp3',

  './audio/letter_ghayn_word_ragheef.mp3',

  './audio/letter_ghayn_word_rassam.mp3',

  './audio/letter_ghayn_word_saaqee.mp3',

  './audio/letter_ghayn_word_sabbaagh.mp3',

  './audio/letter_ghayn_word_sadeeqee.mp3',

  './audio/letter_ghayn_word_sagheer.mp3',

  './audio/letter_ghayn_word_samgh.mp3',

  './audio/letter_ghayn_word_shariba.mp3',

  './audio/letter_ghayn_word_shukran.mp3',

  './audio/letter_ghayn_word_soorah.mp3',

  './audio/letter_ghayn_word_taghleef.mp3',

  './audio/letter_ghayn_word_taghreed.mp3',

  './audio/letter_ghayn_word_tasbugh.mp3',

  './audio/letter_ghayn_word_ulbah.mp3',

  './audio/letter_ghayn_wrong.mp3',

  './audio/letter_h_analysis_intro.mp3',

  './audio/letter_h_blend_intro.mp3',

  './audio/letter_h_correct.mp3',

  './audio/letter_h_draw_hint.mp3',

  './audio/letter_h_encourage_super.mp3',

  './audio/letter_h_intro.mp3',

  './audio/letter_h_long_aa.mp3',

  './audio/letter_h_long_ee.mp3',

  './audio/letter_h_long_oo.mp3',

  './audio/letter_h_merge_fallaah.mp3',

  './audio/letter_h_merge_haamid.mp3',

  './audio/letter_h_merge_haaris.mp3',

  './audio/letter_h_merge_haatim.mp3',

  './audio/letter_h_merge_haql.mp3',

  './audio/letter_h_merge_hasan.mp3',

  './audio/letter_h_merge_mahasin.mp3',

  './audio/letter_h_merge_sahab.mp3',

  './audio/letter_h_merge_salah.mp3',

  './audio/letter_h_phoneme_faseeh.mp3',

  './audio/letter_h_quiz_intro.mp3',

  './audio/letter_h_read_b1.mp3',

  './audio/letter_h_read_b2.mp3',

  './audio/letter_h_read_b3.mp3',

  './audio/letter_h_read_b4.mp3',

  './audio/letter_h_read_b5.mp3',

  './audio/letter_h_read_book_full.mp3',

  './audio/letter_h_read_f1.mp3',

  './audio/letter_h_read_f2.mp3',

  './audio/letter_h_read_f3.mp3',

  './audio/letter_h_read_f4.mp3',

  './audio/letter_h_read_f5.mp3',

  './audio/letter_h_read_f6.mp3',

  './audio/letter_h_read_f7.mp3',

  './audio/letter_h_read_fallaah_full.mp3',

  './audio/letter_h_read_intro.mp3',

  './audio/letter_h_read_t1.mp3',

  './audio/letter_h_read_t2.mp3',

  './audio/letter_h_read_t3.mp3',

  './audio/letter_h_read_t4.mp3',

  './audio/letter_h_read_t5.mp3',

  './audio/letter_h_read_t6.mp3',

  './audio/letter_h_read_telmeeth_full.mp3',

  './audio/letter_h_scene_story.mp3',

  './audio/letter_h_short_a.mp3',

  './audio/letter_h_short_i.mp3',

  './audio/letter_h_short_u.mp3',

  './audio/letter_h_sound.mp3',

  './audio/letter_h_split_fallaah.mp3',

  './audio/letter_h_split_habl.mp3',

  './audio/letter_h_split_haql.mp3',

  './audio/letter_h_split_hisaan.mp3',

  './audio/letter_h_split_mahfazah.mp3',

  './audio/letter_h_split_miftaah.mp3',

  './audio/letter_h_split_nahl.mp3',

  './audio/letter_h_split_qamh.mp3',

  './audio/letter_h_split_salah.mp3',

  './audio/letter_h_syl_fah.mp3',

  './audio/letter_h_syl_mah.mp3',

  './audio/letter_h_syl_mih.mp3',

  './audio/letter_h_tanween_dham.mp3',

  './audio/letter_h_tanween_fath.mp3',

  './audio/letter_h_tanween_kasr.mp3',

  './audio/letter_h_vowels_station.mp3',

  './audio/letter_h_word_fahm.mp3',

  './audio/letter_h_word_fallaah.mp3',

  './audio/letter_h_word_haait.mp3',

  './audio/letter_h_word_haamid.mp3',

  './audio/letter_h_word_haaris.mp3',

  './audio/letter_h_word_haatim.mp3',

  './audio/letter_h_word_habl.mp3',

  './audio/letter_h_word_hamaamah.mp3',

  './audio/letter_h_word_hanaan.mp3',

  './audio/letter_h_word_haql.mp3',

  './audio/letter_h_word_hasan.mp3',

  './audio/letter_h_word_hasheesh.mp3',

  './audio/letter_h_word_hayawan.mp3',

  './audio/letter_h_word_heetaan.mp3',

  './audio/letter_h_word_hisaan.mp3',

  './audio/letter_h_word_hithaa.mp3',

  './audio/letter_h_word_hoot.mp3',

  './audio/letter_h_word_huboob.mp3',

  './audio/letter_h_word_mahasin.mp3',

  './audio/letter_h_word_mahfazah.mp3',

  './audio/letter_h_word_miftaah.mp3',

  './audio/letter_h_word_mihraar.mp3',

  './audio/letter_h_word_milh.mp3',

  './audio/letter_h_word_nahl.mp3',

  './audio/letter_h_word_qamh.mp3',

  './audio/letter_h_word_sahab.mp3',

  './audio/letter_h_word_salah.mp3',

  './audio/letter_h_word_telmeeth.mp3',

  './audio/letter_h_word_timsah.mp3',

  './audio/letter_h_words_intro.mp3',

  './audio/letter_h_wrong.mp3',

  './audio/letter_ha_act1_intro.mp3',

  './audio/letter_ha_act2_intro.mp3',

  './audio/letter_ha_act3_intro.mp3',

  './audio/letter_ha_act4_intro.mp3',

  './audio/letter_ha_act5_intro.mp3',

  './audio/letter_ha_act6_intro.mp3',

  './audio/letter_ha_act7_intro.mp3',

  './audio/letter_ha_act8_intro.mp3',

  './audio/letter_ha_act9_intro.mp3',

  './audio/letter_ha_correct.mp3',

  './audio/letter_ha_encourage_super.mp3',

  './audio/letter_ha_intro.mp3',

  './audio/letter_ha_long_aa.mp3',

  './audio/letter_ha_long_ee.mp3',

  './audio/letter_ha_long_oo.mp3',

  './audio/letter_ha_merge_haadi.mp3',

  './audio/letter_ha_merge_hadeel.mp3',

  './audio/letter_ha_merge_hadiyyah.mp3',

  './audio/letter_ha_merge_naheed.mp3',

  './audio/letter_ha_phoneme_faseeh.mp3',

  './audio/letter_ha_quiz_intro.mp3',

  './audio/letter_ha_read_intro.mp3',

  './audio/letter_ha_read_p117_full.mp3',

  './audio/letter_ha_read_p117_para_full.mp3',

  './audio/letter_ha_read_p117_para_s1.mp3',

  './audio/letter_ha_read_p117_para_s2.mp3',

  './audio/letter_ha_read_p117_s1.mp3',

  './audio/letter_ha_read_p117_s2.mp3',

  './audio/letter_ha_read_p117_s3.mp3',

  './audio/letter_ha_scene_story.mp3',

  './audio/letter_ha_short_a.mp3',

  './audio/letter_ha_short_i.mp3',

  './audio/letter_ha_short_u.mp3',

  './audio/letter_ha_sound.mp3',

  './audio/letter_ha_split_hudhud.mp3',

  './audio/letter_ha_split_muharrij.mp3',

  './audio/letter_ha_split_saheel.mp3',

  './audio/letter_ha_story_hilaal_full.mp3',

  './audio/letter_ha_story_hilaal_s1.mp3',

  './audio/letter_ha_story_hilaal_s2.mp3',

  './audio/letter_ha_story_hilaal_s3.mp3',

  './audio/letter_ha_story_hilaal_s4.mp3',

  './audio/letter_ha_story_miah_full.mp3',

  './audio/letter_ha_story_miah_s1.mp3',

  './audio/letter_ha_story_miah_s2.mp3',

  './audio/letter_ha_story_miah_s3.mp3',

  './audio/letter_ha_story_miah_s4.mp3',

  './audio/letter_ha_story_miah_s5.mp3',

  './audio/letter_ha_story_nabeeh_full.mp3',

  './audio/letter_ha_story_nabeeh_s1.mp3',

  './audio/letter_ha_story_nabeeh_s2.mp3',

  './audio/letter_ha_story_nabeeh_s3.mp3',

  './audio/letter_ha_story_nabeeh_s4.mp3',

  './audio/letter_ha_syl_fah.mp3',

  './audio/letter_ha_syl_muh.mp3',

  './audio/letter_ha_syl_nah.mp3',

  './audio/letter_ha_syl_sah.mp3',

  './audio/letter_ha_syl_waj.mp3',

  './audio/letter_ha_syl_zah.mp3',

  './audio/letter_ha_word_abooh.mp3',

  './audio/letter_ha_word_allah.mp3',

  './audio/letter_ha_word_almatar.mp3',

  './audio/letter_ha_word_alzar.mp3',

  './audio/letter_ha_word_buldaan.mp3',

  './audio/letter_ha_word_dhahaba.mp3',

  './audio/letter_ha_word_fahd.mp3',

  './audio/letter_ha_word_haadi.mp3',

  './audio/letter_ha_word_haasoob.mp3',

  './audio/letter_ha_word_haatif.mp3',

  './audio/letter_ha_word_habata.mp3',

  './audio/letter_ha_word_hadeel.mp3',

  './audio/letter_ha_word_hadeer.mp3',

  './audio/letter_ha_word_hadiyyah.mp3',

  './audio/letter_ha_word_hilaal.mp3',

  './audio/letter_ha_word_hirrah.mp3',

  './audio/letter_ha_word_hisham.mp3',

  './audio/letter_ha_word_hiyaam.mp3',

  './audio/letter_ha_word_huda.mp3',

  './audio/letter_ha_word_hudhud.mp3',

  './audio/letter_ha_word_humaam.mp3',

  './audio/letter_ha_word_mahdi.mp3',

  './audio/letter_ha_word_miah.mp3',

  './audio/letter_ha_word_mufeedah.mp3',

  './audio/letter_ha_word_muharrij.mp3',

  './audio/letter_ha_word_muhr.mp3',

  './audio/letter_ha_word_mukhtalifah.mp3',

  './audio/letter_ha_word_munabbih.mp3',

  './audio/letter_ha_word_nabeeh.mp3',

  './audio/letter_ha_word_naheed.mp3',

  './audio/letter_ha_word_nahr.mp3',

  './audio/letter_ha_word_raaka.mp3',

  './audio/letter_ha_word_saheel.mp3',

  './audio/letter_ha_word_sahm.mp3',

  './audio/letter_ha_word_shubbaak.mp3',

  './audio/letter_ha_word_sihaam.mp3',

  './audio/letter_ha_word_suhaad.mp3',

  './audio/letter_ha_word_suhool.mp3',

  './audio/letter_ha_word_taahi.mp3',

  './audio/letter_ha_word_tasqi.mp3',

  './audio/letter_ha_word_wajh.mp3',

  './audio/letter_ha_word_yazra.mp3',

  './audio/letter_ha_word_yusaaiduh.mp3',

  './audio/letter_ha_word_yusafir.mp3',

  './audio/letter_ha_word_zahrah.mp3',

  './audio/letter_ha_word_zuhoor.mp3',

  './audio/letter_ha_wrong.mp3',

  './audio/letter_hamza_analysis_intro.mp3',

  './audio/letter_hamza_blend_intro.mp3',

  './audio/letter_hamza_correct.mp3',

  './audio/letter_hamza_draw_hint.mp3',

  './audio/letter_hamza_encourage_super.mp3',

  './audio/letter_hamza_intro.mp3',

  './audio/letter_hamza_long_aa.mp3',

  './audio/letter_hamza_long_ee.mp3',

  './audio/letter_hamza_long_oo.mp3',

  './audio/letter_hamza_merge_ameen.mp3',

  './audio/letter_hamza_merge_ashjaar.mp3',

  './audio/letter_hamza_merge_bannaa.mp3',

  './audio/letter_hamza_merge_faar.mp3',

  './audio/letter_hamza_merge_ureed.mp3',

  './audio/letter_hamza_phoneme_faseeh.mp3',

  './audio/letter_hamza_quiz_intro.mp3',

  './audio/letter_hamza_read_a1.mp3',

  './audio/letter_hamza_read_a2.mp3',

  './audio/letter_hamza_read_a3.mp3',

  './audio/letter_hamza_read_a4.mp3',

  './audio/letter_hamza_read_a5.mp3',

  './audio/letter_hamza_read_ameen_full.mp3',

  './audio/letter_hamza_read_ayman_full.mp3',

  './audio/letter_hamza_read_book_full.mp3',

  './audio/letter_hamza_read_intro.mp3',

  './audio/letter_hamza_read_s1.mp3',

  './audio/letter_hamza_read_s2.mp3',

  './audio/letter_hamza_read_y1.mp3',

  './audio/letter_hamza_read_y2.mp3',

  './audio/letter_hamza_read_y3.mp3',

  './audio/letter_hamza_read_y4.mp3',

  './audio/letter_hamza_scene_story.mp3',

  './audio/letter_hamza_shape_alif_down.mp3',

  './audio/letter_hamza_shape_alif_up.mp3',

  './audio/letter_hamza_shape_line.mp3',

  './audio/letter_hamza_shape_nabra.mp3',

  './audio/letter_hamza_shape_waw.mp3',

  './audio/letter_hamza_shapes_intro.mp3',

  './audio/letter_hamza_short_a.mp3',

  './audio/letter_hamza_short_i.mp3',

  './audio/letter_hamza_short_u.mp3',

  './audio/letter_hamza_sound.mp3',

  './audio/letter_hamza_split_ashjaar.mp3',

  './audio/letter_hamza_split_azra.mp3',

  './audio/letter_hamza_split_faar.mp3',

  './audio/letter_hamza_split_ihsaan.mp3',

  './audio/letter_hamza_split_maa.mp3',

  './audio/letter_hamza_split_raas.mp3',

  './audio/letter_hamza_split_ureed.mp3',

  './audio/letter_hamza_split_yaqra.mp3',

  './audio/letter_hamza_syl_ash.mp3',

  './audio/letter_hamza_syl_az.mp3',

  './audio/letter_hamza_syl_fa.mp3',

  './audio/letter_hamza_syl_ih.mp3',

  './audio/letter_hamza_syl_intro.mp3',

  './audio/letter_hamza_syl_ma.mp3',

  './audio/letter_hamza_syl_ra.mp3',

  './audio/letter_hamza_syl_yaq.mp3',

  './audio/letter_hamza_vowels_station.mp3',

  './audio/letter_hamza_word_adeeb.mp3',

  './audio/letter_hamza_word_ahmad.mp3',

  './audio/letter_hamza_word_ameen.mp3',

  './audio/letter_hamza_word_ana.mp3',

  './audio/letter_hamza_word_arnab.mp3',

  './audio/letter_hamza_word_asad.mp3',

  './audio/letter_hamza_word_ashjaar.mp3',

  './audio/letter_hamza_word_ayman.mp3',

  './audio/letter_hamza_word_azhaar.mp3',

  './audio/letter_hamza_word_azra.mp3',

  './audio/letter_hamza_word_bannaa.mp3',

  './audio/letter_hamza_word_bi_r.mp3',

  './audio/letter_hamza_word_binaa.mp3',

  './audio/letter_hamza_word_daafi.mp3',

  './audio/letter_hamza_word_darana.mp3',

  './audio/letter_hamza_word_eemaan.mp3',

  './audio/letter_hamza_word_faar.mp3',

  './audio/letter_hamza_word_faas.mp3',

  './audio/letter_hamza_word_fuad.mp3',

  './audio/letter_hamza_word_hadeeqatina.mp3',

  './audio/letter_hamza_word_hawaa.mp3',

  './audio/letter_hamza_word_hizan.mp3',

  './audio/letter_hamza_word_ibreeq.mp3',

  './audio/letter_hamza_word_ihsaan.mp3',

  './audio/letter_hamza_word_inaa.mp3',

  './audio/letter_hamza_word_iqbaal.mp3',

  './audio/letter_hamza_word_iwazzah.mp3',

  './audio/letter_hamza_word_lu_lu.mp3',

  './audio/letter_hamza_word_maa.mp3',

  './audio/letter_hamza_word_mamoon.mp3',

  './audio/letter_hamza_word_qaraa.mp3',

  './audio/letter_hamza_word_qaraana.mp3',

  './audio/letter_hamza_word_raas.mp3',

  './audio/letter_hamza_word_samaa.mp3',

  './audio/letter_hamza_word_shaati.mp3',

  './audio/letter_hamza_word_suaal.mp3',

  './audio/letter_hamza_word_taqool.mp3',

  './audio/letter_hamza_word_ukhtuboot.mp3',

  './audio/letter_hamza_word_ummee.mp3',

  './audio/letter_hamza_word_ureed.mp3',

  './audio/letter_hamza_word_uzun.mp3',

  './audio/letter_hamza_word_yabnee.mp3',

  './audio/letter_hamza_word_yalab.mp3',

  './audio/letter_hamza_word_yaqra.mp3',

  './audio/letter_hamza_word_zi_b.mp3',

  './audio/letter_hamza_words_intro.mp3',

  './audio/letter_hamza_wrong.mp3',

  './audio/letter_j_analysis_intro.mp3',

  './audio/letter_j_blend_intro.mp3',

  './audio/letter_j_correct.mp3',

  './audio/letter_j_draw_hint.mp3',

  './audio/letter_j_encourage_super.mp3',

  './audio/letter_j_intro.mp3',

  './audio/letter_j_long_aa.mp3',

  './audio/letter_j_long_ee.mp3',

  './audio/letter_j_long_oo.mp3',

  './audio/letter_j_merge_jaalis.mp3',

  './audio/letter_j_merge_jaami.mp3',

  './audio/letter_j_merge_jameel.mp3',

  './audio/letter_j_merge_jimaal.mp3',

  './audio/letter_j_merge_jubn.mp3',

  './audio/letter_j_merge_thalj.mp3',

  './audio/letter_j_phoneme_faseeh.mp3',

  './audio/letter_j_quiz_intro.mp3',

  './audio/letter_j_read_b1.mp3',

  './audio/letter_j_read_b2.mp3',

  './audio/letter_j_read_b3.mp3',

  './audio/letter_j_read_b4.mp3',

  './audio/letter_j_read_b5.mp3',

  './audio/letter_j_read_book_full.mp3',

  './audio/letter_j_read_f1.mp3',

  './audio/letter_j_read_f2.mp3',

  './audio/letter_j_read_f3.mp3',

  './audio/letter_j_read_f4.mp3',

  './audio/letter_j_read_f5.mp3',

  './audio/letter_j_read_f6.mp3',

  './audio/letter_j_read_faraj_full.mp3',

  './audio/letter_j_read_intro.mp3',

  './audio/letter_j_scene_story.mp3',

  './audio/letter_j_short_a.mp3',

  './audio/letter_j_short_i.mp3',

  './audio/letter_j_short_u.mp3',

  './audio/letter_j_sound.mp3',

  './audio/letter_j_split_ajeen.mp3',

  './audio/letter_j_split_faraj.mp3',

  './audio/letter_j_split_jaamoos.mp3',

  './audio/letter_j_split_jazar.mp3',

  './audio/letter_j_split_majoon.mp3',

  './audio/letter_j_split_najm.mp3',

  './audio/letter_j_split_nassaaj.mp3',

  './audio/letter_j_syl_mij.mp3',

  './audio/letter_j_syl_naj.mp3',

  './audio/letter_j_syl_rij.mp3',

  './audio/letter_j_syl_yaj.mp3',

  './audio/letter_j_tanween_dham.mp3',

  './audio/letter_j_tanween_fath.mp3',

  './audio/letter_j_tanween_kasr.mp3',

  './audio/letter_j_vowels_station.mp3',

  './audio/letter_j_word_ajeen.mp3',

  './audio/letter_j_word_alaihi.mp3',

  './audio/letter_j_word_ashjaaran.mp3',

  './audio/letter_j_word_bisaat.mp3',

  './audio/letter_j_word_burj.mp3',

  './audio/letter_j_word_dajaajah.mp3',

  './audio/letter_j_word_faraj.mp3',

  './audio/letter_j_word_hadeeqah.mp3',

  './audio/letter_j_word_hajar.mp3',

  './audio/letter_j_word_jaalis.mp3',

  './audio/letter_j_word_jaami.mp3',

  './audio/letter_j_word_jaamoos.mp3',

  './audio/letter_j_word_jaamoosah.mp3',

  './audio/letter_j_word_jadeedan.mp3',

  './audio/letter_j_word_jamal.mp3',

  './audio/letter_j_word_jameel.mp3',

  './audio/letter_j_word_jameelah.mp3',

  './audio/letter_j_word_jana.mp3',

  './audio/letter_j_word_jaras.mp3',

  './audio/letter_j_word_jawrab.mp3',

  './audio/letter_j_word_jazar.mp3',

  './audio/letter_j_word_jazeerah.mp3',

  './audio/letter_j_word_jimaal.mp3',

  './audio/letter_j_word_jisr.mp3',

  './audio/letter_j_word_jubn.mp3',

  './audio/letter_j_word_khurooj.mp3',

  './audio/letter_j_word_madrasah.mp3',

  './audio/letter_j_word_mahirah.mp3',

  './audio/letter_j_word_majoon.mp3',

  './audio/letter_j_word_mijhar.mp3',

  './audio/letter_j_word_najm.mp3',

  './audio/letter_j_word_nassaaj.mp3',

  './audio/letter_j_word_nassaajah.mp3',

  './audio/letter_j_word_nawras.mp3',

  './audio/letter_j_word_nujoom.mp3',

  './audio/letter_j_word_qumaash.mp3',

  './audio/letter_j_word_rijl.mp3',

  './audio/letter_j_word_saara.mp3',

  './audio/letter_j_word_shaariuna.mp3',

  './audio/letter_j_word_shajarah.mp3',

  './audio/letter_j_word_taaburu.mp3',

  './audio/letter_j_word_taaj.mp3',

  './audio/letter_j_word_tadrusaan.mp3',

  './audio/letter_j_word_tansiju.mp3',

  './audio/letter_j_word_thalj.mp3',

  './audio/letter_j_word_tunaqqishu.mp3',

  './audio/letter_j_word_wardan.mp3',

  './audio/letter_j_word_wasan.mp3',

  './audio/letter_j_word_widaad.mp3',

  './audio/letter_j_word_wisaam.mp3',

  './audio/letter_j_word_yansiju.mp3',

  './audio/letter_j_words_intro.mp3',

  './audio/letter_j_wrong.mp3',

  './audio/letter_kaf_analysis_intro.mp3',

  './audio/letter_kaf_blend_intro.mp3',

  './audio/letter_kaf_correct.mp3',

  './audio/letter_kaf_draw_hint.mp3',

  './audio/letter_kaf_encourage_super.mp3',

  './audio/letter_kaf_intro.mp3',

  './audio/letter_kaf_long_aa.mp3',

  './audio/letter_kaf_long_ee.mp3',

  './audio/letter_kaf_long_oo.mp3',

  './audio/letter_kaf_merge_burkaan.mp3',

  './audio/letter_kaf_merge_hikayaat.mp3',

  './audio/letter_kaf_merge_kabeerah.mp3',

  './audio/letter_kaf_merge_kitaab.mp3',

  './audio/letter_kaf_merge_maktabah.mp3',

  './audio/letter_kaf_merge_sentence.mp3',

  './audio/letter_kaf_phoneme_faseeh.mp3',

  './audio/letter_kaf_quiz_intro.mp3',

  './audio/letter_kaf_read_b1.mp3',

  './audio/letter_kaf_read_b2.mp3',

  './audio/letter_kaf_read_book_full.mp3',

  './audio/letter_kaf_read_intro.mp3',

  './audio/letter_kaf_read_k1.mp3',

  './audio/letter_kaf_read_k2.mp3',

  './audio/letter_kaf_read_k3.mp3',

  './audio/letter_kaf_read_k4.mp3',

  './audio/letter_kaf_read_k5.mp3',

  './audio/letter_kaf_read_k6.mp3',

  './audio/letter_kaf_read_k7.mp3',

  './audio/letter_kaf_read_kaamil_full.mp3',

  './audio/letter_kaf_read_m1.mp3',

  './audio/letter_kaf_read_m2.mp3',

  './audio/letter_kaf_read_m3.mp3',

  './audio/letter_kaf_read_m4.mp3',

  './audio/letter_kaf_read_m5.mp3',

  './audio/letter_kaf_read_maalik_full.mp3',

  './audio/letter_kaf_scene_story.mp3',

  './audio/letter_kaf_shape_first.mp3',

  './audio/letter_kaf_shape_last_conn.mp3',

  './audio/letter_kaf_shape_last_sep.mp3',

  './audio/letter_kaf_shape_mid.mp3',

  './audio/letter_kaf_shapes_intro.mp3',

  './audio/letter_kaf_short_a.mp3',

  './audio/letter_kaf_short_i.mp3',

  './audio/letter_kaf_short_u.mp3',

  './audio/letter_kaf_sound.mp3',

  './audio/letter_kaf_split_burkaan.mp3',

  './audio/letter_kaf_split_deek.mp3',

  './audio/letter_kaf_split_hikayaat.mp3',

  './audio/letter_kaf_split_kabeerah.mp3',

  './audio/letter_kaf_split_kawthar.mp3',

  './audio/letter_kaf_split_kitaab.mp3',

  './audio/letter_kaf_split_maktabah.mp3',

  './audio/letter_kaf_syl_duk.mp3',

  './audio/letter_kaf_syl_intro.mp3',

  './audio/letter_kaf_syl_mak.mp3',

  './audio/letter_kaf_syl_mik.mp3',

  './audio/letter_kaf_syl_ruk.mp3',

  './audio/letter_kaf_vowels_station.mp3',

  './audio/letter_kaf_word_ajeebah.mp3',

  './audio/letter_kaf_word_alaykum.mp3',

  './audio/letter_kaf_word_an.mp3',

  './audio/letter_kaf_word_anka.mp3',

  './audio/letter_kaf_word_arsil.mp3',

  './audio/letter_kaf_word_assalaamu.mp3',

  './audio/letter_kaf_word_assamaka.mp3',

  './audio/letter_kaf_word_baba.mp3',

  './audio/letter_kaf_word_burkaan.mp3',

  './audio/letter_kaf_word_deek.mp3',

  './audio/letter_kaf_word_faqaala.mp3',

  './audio/letter_kaf_word_hayawaanaat.mp3',

  './audio/letter_kaf_word_hikayaat.mp3',

  './audio/letter_kaf_word_hikayah.mp3',

  './audio/letter_kaf_word_ilal_amm.mp3',

  './audio/letter_kaf_word_inda.mp3',

  './audio/letter_kaf_word_kaamil.mp3',

  './audio/letter_kaf_word_kabeerah.mp3',

  './audio/letter_kaf_word_kalb.mp3',

  './audio/letter_kaf_word_kamanjah.mp3',

  './audio/letter_kaf_word_kareem.mp3',

  './audio/letter_kaf_word_kataba.mp3',

  './audio/letter_kaf_word_kawthar.mp3',

  './audio/letter_kaf_word_kees.mp3',

  './audio/letter_kaf_word_kinaan.mp3',

  './audio/letter_kaf_word_kitaab.mp3',

  './audio/letter_kaf_word_kitaaban.mp3',

  './audio/letter_kaf_word_koob.mp3',

  './audio/letter_kaf_word_kurah.mp3',

  './audio/letter_kaf_word_laka.mp3',

  './audio/letter_kaf_word_lana.mp3',

  './audio/letter_kaf_word_lazeez.mp3',

  './audio/letter_kaf_word_maa.mp3',

  './audio/letter_kaf_word_maalik.mp3',

  './audio/letter_kaf_word_maktabah.mp3',

  './audio/letter_kaf_word_maktooban.mp3',

  './audio/letter_kaf_word_mikwaah.mp3',

  './audio/letter_kaf_word_nas-alu.mp3',

  './audio/letter_kaf_word_qadeemah.mp3',

  './audio/letter_kaf_word_qara-tu.mp3',

  './audio/letter_kaf_word_rukbah.mp3',

  './audio/letter_kaf_word_samak.mp3',

  './audio/letter_kaf_word_sammaak.mp3',

  './audio/letter_kaf_word_shibaak.mp3',

  './audio/letter_kaf_word_shukran.mp3',

  './audio/letter_kaf_word_sindibaad.mp3',

  './audio/letter_kaf_word_wa-bisaat.mp3',

  './audio/letter_kaf_word_yabeeo.mp3',

  './audio/letter_kaf_word_yahwee.mp3',

  './audio/letter_kaf_word_yaktubu.mp3',

  './audio/letter_kaf_word_yaqrao.mp3',

  './audio/letter_kaf_word_yateer.mp3',

  './audio/letter_kaf_word_zawraq.mp3',

  './audio/letter_kaf_words_intro.mp3',

  './audio/letter_kaf_wrong.mp3',

  './audio/letter_kha_analysis_intro.mp3',

  './audio/letter_kha_blend_intro.mp3',

  './audio/letter_kha_correct.mp3',

  './audio/letter_kha_draw_hint.mp3',

  './audio/letter_kha_encourage_super.mp3',

  './audio/letter_kha_intro.mp3',

  './audio/letter_kha_long_aa.mp3',

  './audio/letter_kha_long_ee.mp3',

  './audio/letter_kha_long_oo.mp3',

  './audio/letter_kha_merge_fakhoor.mp3',

  './audio/letter_kha_merge_khaatam.mp3',

  './audio/letter_kha_merge_kholood.mp3',

  './audio/letter_kha_merge_matbakh.mp3',

  './audio/letter_kha_merge_sentence.mp3',

  './audio/letter_kha_merge_sukhoor.mp3',

  './audio/letter_kha_phoneme_faseeh.mp3',

  './audio/letter_kha_quiz_intro.mp3',

  './audio/letter_kha_read_b1.mp3',

  './audio/letter_kha_read_b2.mp3',

  './audio/letter_kha_read_b3.mp3',

  './audio/letter_kha_read_book_full.mp3',

  './audio/letter_kha_read_intro.mp3',

  './audio/letter_kha_read_k1.mp3',

  './audio/letter_kha_read_k2.mp3',

  './audio/letter_kha_read_k3.mp3',

  './audio/letter_kha_read_k4.mp3',

  './audio/letter_kha_read_k5.mp3',

  './audio/letter_kha_read_khaleel_full.mp3',

  './audio/letter_kha_scene_story.mp3',

  './audio/letter_kha_shape_first.mp3',

  './audio/letter_kha_shape_last_conn.mp3',

  './audio/letter_kha_shape_last_sep.mp3',

  './audio/letter_kha_shape_mid.mp3',

  './audio/letter_kha_shapes_intro.mp3',

  './audio/letter_kha_short_a.mp3',

  './audio/letter_kha_short_i.mp3',

  './audio/letter_kha_short_u.mp3',

  './audio/letter_kha_sound.mp3',

  './audio/letter_kha_split_fakhoor.mp3',

  './audio/letter_kha_split_khaatam.mp3',

  './audio/letter_kha_split_khaleel.mp3',

  './audio/letter_kha_split_kharaja.mp3',

  './audio/letter_kha_split_kholood.mp3',

  './audio/letter_kha_split_matbakh.mp3',

  './audio/letter_kha_split_nakhla.mp3',

  './audio/letter_kha_split_sukhoor.mp3',

  './audio/letter_kha_syl_akh.mp3',

  './audio/letter_kha_syl_intro.mp3',

  './audio/letter_kha_syl_mat.mp3',

  './audio/letter_kha_syl_nakh.mp3',

  './audio/letter_kha_syl_sakh.mp3',

  './audio/letter_kha_vowels_station.mp3',

  './audio/letter_kha_word_ahdarat.mp3',

  './audio/letter_kha_word_akhdar.mp3',

  './audio/letter_kha_word_battikh.mp3',

  './audio/letter_kha_word_bi-alwaan.mp3',

  './audio/letter_kha_word_dukhaan.mp3',

  './audio/letter_kha_word_fakhoor.mp3',

  './audio/letter_kha_word_jameelah.mp3',

  './audio/letter_kha_word_khaabirah.mp3',

  './audio/letter_kha_word_khaalatee.mp3',

  './audio/letter_kha_word_khaatam.mp3',

  './audio/letter_kha_word_khaldoon.mp3',

  './audio/letter_kha_word_khaleel.mp3',

  './audio/letter_kha_word_kharaja.mp3',

  './audio/letter_kha_word_kharoof.mp3',

  './audio/letter_kha_word_khashab.mp3',

  './audio/letter_kha_word_khass.mp3',

  './audio/letter_kha_word_khaymah.mp3',

  './audio/letter_kha_word_khayt.mp3',

  './audio/letter_kha_word_khitaam.mp3',

  './audio/letter_kha_word_khiyaar.mp3',

  './audio/letter_kha_word_kholood.mp3',

  './audio/letter_kha_word_khoodhah.mp3',

  './audio/letter_kha_word_khookh.mp3',

  './audio/letter_kha_word_khubz.mp3',

  './audio/letter_kha_word_khudaaran.mp3',

  './audio/letter_kha_word_kookh.mp3',

  './audio/letter_kha_word_matbakh.mp3',

  './audio/letter_kha_word_mutanawwiah.mp3',

  './audio/letter_kha_word_nakheel.mp3',

  './audio/letter_kha_word_nakhla.mp3',

  './audio/letter_kha_word_saakhinan.mp3',

  './audio/letter_kha_word_sakhrah.mp3',

  './audio/letter_kha_word_sukhoor.mp3',

  './audio/letter_kha_word_tatbakhu.mp3',

  './audio/letter_kha_word_ukhtuboot.mp3',

  './audio/letter_kha_word_wadaat.mp3',

  './audio/letter_kha_word_yabeeu.mp3',

  './audio/letter_kha_words_intro.mp3',

  './audio/letter_kha_wrong.mp3',

  './audio/letter_l_nabeel_analysis_intro.mp3',

  './audio/letter_l_nabeel_blend_intro.mp3',

  './audio/letter_l_nabeel_correct.mp3',

  './audio/letter_l_nabeel_draw_hint.mp3',

  './audio/letter_l_nabeel_encourage_super.mp3',

  './audio/letter_l_nabeel_intro.mp3',

  './audio/letter_l_nabeel_long_aa.mp3',

  './audio/letter_l_nabeel_long_ee.mp3',

  './audio/letter_l_nabeel_long_oo.mp3',

  './audio/letter_l_nabeel_merge_baladi.mp3',

  './audio/letter_l_nabeel_merge_baqqal.mp3',

  './audio/letter_l_nabeel_merge_laban.mp3',

  './audio/letter_l_nabeel_merge_malabis.mp3',

  './audio/letter_l_nabeel_merge_nabeel.mp3',

  './audio/letter_l_nabeel_merge_qala.mp3',

  './audio/letter_l_nabeel_merge_qaleel.mp3',

  './audio/letter_l_nabeel_merge_qulna.mp3',

  './audio/letter_l_nabeel_merge_rumman.mp3',

  './audio/letter_l_nabeel_phoneme_faseeh.mp3',

  './audio/letter_l_nabeel_quiz_intro.mp3',

  './audio/letter_l_nabeel_read_full.mp3',

  './audio/letter_l_nabeel_read_intro.mp3',

  './audio/letter_l_nabeel_read_s1.mp3',

  './audio/letter_l_nabeel_read_s2.mp3',

  './audio/letter_l_nabeel_read_s3.mp3',

  './audio/letter_l_nabeel_read_s4.mp3',

  './audio/letter_l_nabeel_read_s5.mp3',

  './audio/letter_l_nabeel_read_s6.mp3',

  './audio/letter_l_nabeel_scene_story.mp3',

  './audio/letter_l_nabeel_short_a.mp3',

  './audio/letter_l_nabeel_short_i.mp3',

  './audio/letter_l_nabeel_short_u.mp3',

  './audio/letter_l_nabeel_sound.mp3',

  './audio/letter_l_nabeel_split_baladi.mp3',

  './audio/letter_l_nabeel_split_baqqal.mp3',

  './audio/letter_l_nabeel_split_fulful.mp3',

  './audio/letter_l_nabeel_split_laban.mp3',

  './audio/letter_l_nabeel_split_malab.mp3',

  './audio/letter_l_nabeel_split_nabeel.mp3',

  './audio/letter_l_nabeel_split_namlah.mp3',

  './audio/letter_l_nabeel_split_qala.mp3',

  './audio/letter_l_nabeel_split_qaleel.mp3',

  './audio/letter_l_nabeel_split_qulna.mp3',

  './audio/letter_l_nabeel_split_rumman.mp3',

  './audio/letter_l_nabeel_syl_dal.mp3',

  './audio/letter_l_nabeel_syl_ful.mp3',

  './audio/letter_l_nabeel_syl_mal.mp3',

  './audio/letter_l_nabeel_syl_qul.mp3',

  './audio/letter_l_nabeel_vowels_station.mp3',

  './audio/letter_l_nabeel_word_aalim.mp3',

  './audio/letter_l_nabeel_word_baladi.mp3',

  './audio/letter_l_nabeel_word_baqqal.mp3',

  './audio/letter_l_nabeel_word_bayti.mp3',

  './audio/letter_l_nabeel_word_bustani.mp3',

  './audio/letter_l_nabeel_word_dalw.mp3',

  './audio/letter_l_nabeel_word_fulful.mp3',

  './audio/letter_l_nabeel_word_ghazal.mp3',

  './audio/letter_l_nabeel_word_haleeb.mp3',

  './audio/letter_l_nabeel_word_kalb.mp3',

  './audio/letter_l_nabeel_word_laban.mp3',

  './audio/letter_l_nabeel_word_ladayna.mp3',

  './audio/letter_l_nabeel_word_lahm.mp3',

  './audio/letter_l_nabeel_word_laib.mp3',

  './audio/letter_l_nabeel_word_limatha.mp3',

  './audio/letter_l_nabeel_word_lisan.mp3',

  './audio/letter_l_nabeel_word_lubah.mp3',

  './audio/letter_l_nabeel_word_malab.mp3',

  './audio/letter_l_nabeel_word_malabis.mp3',

  './audio/letter_l_nabeel_word_nabeel.mp3',

  './audio/letter_l_nabeel_word_namlah.mp3',

  './audio/letter_l_nabeel_word_qala.mp3',

  './audio/letter_l_nabeel_word_qalam.mp3',

  './audio/letter_l_nabeel_word_qaleel.mp3',

  './audio/letter_l_nabeel_word_qulna.mp3',

  './audio/letter_l_nabeel_word_quloob.mp3',

  './audio/letter_l_nabeel_word_raml.mp3',

  './audio/letter_l_nabeel_word_rumman.mp3',

  './audio/letter_l_nabeel_words_intro.mp3',

  './audio/letter_l_nabeel_wrong.mp3',

  './audio/letter_m_analysis_intro.mp3',

  './audio/letter_m_draw_hint.mp3',

  './audio/letter_m_intro.mp3',

  './audio/letter_m_laymun.mp3',

  './audio/letter_m_laymun_vowel.mp3',

  './audio/letter_m_long_a.mp3',

  './audio/letter_m_long_i.mp3',

  './audio/letter_m_long_u.mp3',

  './audio/letter_m_mawz.mp3',

  './audio/letter_m_mawz_vowel.mp3',

  './audio/letter_m_merge_baba.mp3',

  './audio/letter_m_merge_bum.mp3',

  './audio/letter_m_merge_intro.mp3',

  './audio/letter_m_merge_mama.mp3',

  './audio/letter_m_miftah.mp3',

  './audio/letter_m_miqas.mp3',

  './audio/letter_m_mizan.mp3',

  './audio/letter_m_mizan_vowel.mp3',

  './audio/letter_m_mizmar.mp3',

  './audio/letter_m_mizmar_vowel.mp3',

  './audio/letter_m_murabba.mp3',

  './audio/letter_m_muthallath.mp3',

  './audio/letter_m_namr_syllable.mp3',

  './audio/letter_m_qamh.mp3',

  './audio/letter_m_read_all.mp3',

  './audio/letter_m_read_baba.mp3',

  './audio/letter_m_read_bum.mp3',

  './audio/letter_m_read_mama.mp3',

  './audio/letter_m_scene_story.mp3',

  './audio/letter_m_short_a.mp3',

  './audio/letter_m_short_i.mp3',

  './audio/letter_m_short_u.mp3',

  './audio/letter_m_sound.mp3',

  './audio/letter_m_split_bum.mp3',

  './audio/letter_m_split_mama.mp3',

  './audio/letter_m_tamr_syllable.mp3',

  './audio/letter_m_thawm.mp3',

  './audio/letter_m_timsah_syllable.mp3',

  './audio/letter_m_vowels_intro.mp3',

  './audio/letter_marboota_act3_intro.mp3',

  './audio/letter_marboota_act4_intro.mp3',

  './audio/letter_marboota_analysis_intro.mp3',

  './audio/letter_marboota_banaat.mp3',

  './audio/letter_marboota_draw_hint.mp3',

  './audio/letter_marboota_dumyah.mp3',

  './audio/letter_marboota_haqeebah.mp3',

  './audio/letter_marboota_haqeebah_vowel.mp3',

  './audio/letter_marboota_intro.mp3',

  './audio/letter_marboota_lawhah.mp3',

  './audio/letter_marboota_lawhah_shape.mp3',

  './audio/letter_marboota_madrasah.mp3',

  './audio/letter_marboota_madrasah_vowel.mp3',

  './audio/letter_marboota_merge_intro.mp3',

  './audio/letter_marboota_merge_saarah.mp3',

  './audio/letter_marboota_merge_saawah.mp3',

  './audio/letter_marboota_merge_safeenah.mp3',

  './audio/letter_marboota_mibraah.mp3',

  './audio/letter_marboota_mibraah_vowel.mp3',

  './audio/letter_marboota_mimhaah.mp3',

  './audio/letter_marboota_mimhaah_vowel.mp3',

  './audio/letter_marboota_mistarah.mp3',

  './audio/letter_marboota_mistarah_shape.mp3',

  './audio/letter_marboota_mistarah_vowel.mp3',

  './audio/letter_marboota_model_alone.mp3',

  './audio/letter_marboota_model_we.mp3',

  './audio/letter_marboota_model_you.mp3',

  './audio/letter_marboota_namlah.mp3',

  './audio/letter_marboota_read_all.mp3',

  './audio/letter_marboota_read_intro.mp3',

  './audio/letter_marboota_read_sentence1.mp3',

  './audio/letter_marboota_read_sentence2.mp3',

  './audio/letter_marboota_read_sentence3.mp3',

  './audio/letter_marboota_read_sentence_title.mp3',

  './audio/letter_marboota_read_word_deematu.mp3',

  './audio/letter_marboota_read_word_fee.mp3',

  './audio/letter_marboota_read_word_madrasati.mp3',

  './audio/letter_marboota_read_word_saarah.mp3',

  './audio/letter_marboota_read_word_saaratu.mp3',

  './audio/letter_marboota_read_word_sarwatu.mp3',

  './audio/letter_marboota_read_word_tabtasimu.mp3',

  './audio/letter_marboota_read_word_tadrusu.mp3',

  './audio/letter_marboota_read_word_tarsimu.mp3',

  './audio/letter_marboota_rule_summary.mp3',

  './audio/letter_marboota_safeenah.mp3',

  './audio/letter_marboota_samakah.mp3',

  './audio/letter_marboota_scene_story.mp3',

  './audio/letter_marboota_short_a.mp3',

  './audio/letter_marboota_short_i.mp3',

  './audio/letter_marboota_short_u.mp3',

  './audio/letter_marboota_sound.mp3',

  './audio/letter_marboota_split_dumyah.mp3',

  './audio/letter_marboota_split_madrasah.mp3',

  './audio/letter_marboota_split_saarah.mp3',

  './audio/letter_marboota_split_safeenah.mp3',

  './audio/letter_marboota_syllables_intro.mp3',

  './audio/letter_marboota_tilmeezah.mp3',

  './audio/letter_marboota_tilmeezah_vowel.mp3',

  './audio/letter_marboota_toot.mp3',

  './audio/letter_marboota_vowels_intro.mp3',

  './audio/letter_marboota_waqf_wasl.mp3',

  './audio/letter_marboota_wardah.mp3',

  './audio/letter_n_analysis_intro.mp3',

  './audio/letter_n_bint.mp3',

  './audio/letter_n_bint_syllable.mp3',

  './audio/letter_n_bunduq.mp3',

  './audio/letter_n_bunduq_syllable.mp3',

  './audio/letter_n_draw_hint.mp3',

  './audio/letter_n_faanoos.mp3',

  './audio/letter_n_finjaan.mp3',

  './audio/letter_n_hisaan.mp3',

  './audio/letter_n_intro.mp3',

  './audio/letter_n_janeen.mp3',

  './audio/letter_n_junood.mp3',

  './audio/letter_n_long_a.mp3',

  './audio/letter_n_long_i.mp3',

  './audio/letter_n_long_u.mp3',

  './audio/letter_n_merge_intro.mp3',

  './audio/letter_n_merge_naar.mp3',

  './audio/letter_n_merge_nasr.mp3',

  './audio/letter_n_merge_numoor.mp3',

  './audio/letter_n_minjal.mp3',

  './audio/letter_n_minjal_syllable.mp3',

  './audio/letter_n_model_alone.mp3',

  './audio/letter_n_model_we.mp3',

  './audio/letter_n_model_you.mp3',

  './audio/letter_n_naar.mp3',

  './audio/letter_n_naar_vowel.mp3',

  './audio/letter_n_naml.mp3',

  './audio/letter_n_nasr.mp3',

  './audio/letter_n_neeraan.mp3',

  './audio/letter_n_niqaat.mp3',

  './audio/letter_n_niqaat_vowel.mp3',

  './audio/letter_n_nujoom.mp3',

  './audio/letter_n_numoor.mp3',

  './audio/letter_n_read_all.mp3',

  './audio/letter_n_read_intro.mp3',

  './audio/letter_n_read_sentence1.mp3',

  './audio/letter_n_read_sentence2.mp3',

  './audio/letter_n_read_sentence3.mp3',

  './audio/letter_n_read_word_baba.mp3',

  './audio/letter_n_read_word_dada.mp3',

  './audio/letter_n_read_word_faris.mp3',

  './audio/letter_n_read_word_fee.mp3',

  './audio/letter_n_read_word_marsam.mp3',

  './audio/letter_n_read_word_noor.mp3',

  './audio/letter_n_read_word_rasama.mp3',

  './audio/letter_n_read_word_sinan.mp3',

  './audio/letter_n_scene_story.mp3',

  './audio/letter_n_short_a.mp3',

  './audio/letter_n_short_i.mp3',

  './audio/letter_n_short_u.mp3',

  './audio/letter_n_sound.mp3',

  './audio/letter_n_split_manaar.mp3',

  './audio/letter_n_split_noor.mp3',

  './audio/letter_n_split_raneen.mp3',

  './audio/letter_n_split_sinan.mp3',

  './audio/letter_n_syllables_intro.mp3',

  './audio/letter_n_vowels_compare_intro.mp3',

  './audio/letter_n_vowels_intro.mp3',

  './audio/letter_q_booq_analysis_intro.mp3',

  './audio/letter_q_booq_blend_intro.mp3',

  './audio/letter_q_booq_correct.mp3',

  './audio/letter_q_booq_draw_hint.mp3',

  './audio/letter_q_booq_encourage_super.mp3',

  './audio/letter_q_booq_intro.mp3',

  './audio/letter_q_booq_long_aa.mp3',

  './audio/letter_q_booq_long_ee.mp3',

  './audio/letter_q_booq_long_oo.mp3',

  './audio/letter_q_booq_merge_baqar.mp3',

  './audio/letter_q_booq_merge_booq.mp3',

  './audio/letter_q_booq_merge_nadeem.mp3',

  './audio/letter_q_booq_merge_naqeeb.mp3',

  './audio/letter_q_booq_merge_qaadim.mp3',

  './audio/letter_q_booq_merge_qaarib.mp3',

  './audio/letter_q_booq_merge_qadeem.mp3',

  './audio/letter_q_booq_merge_yaqood.mp3',

  './audio/letter_q_booq_phoneme_faseeh.mp3',

  './audio/letter_q_booq_quiz_intro.mp3',

  './audio/letter_q_booq_read_full.mp3',

  './audio/letter_q_booq_read_intro.mp3',

  './audio/letter_q_booq_read_s1.mp3',

  './audio/letter_q_booq_read_s2.mp3',

  './audio/letter_q_booq_read_s3.mp3',

  './audio/letter_q_booq_read_s4.mp3',

  './audio/letter_q_booq_read_s5.mp3',

  './audio/letter_q_booq_read_s6.mp3',

  './audio/letter_q_booq_scene_story.mp3',

  './audio/letter_q_booq_short_a.mp3',

  './audio/letter_q_booq_short_i.mp3',

  './audio/letter_q_booq_short_u.mp3',

  './audio/letter_q_booq_sound.mp3',

  './audio/letter_q_booq_split_baqar.mp3',

  './audio/letter_q_booq_split_booq.mp3',

  './audio/letter_q_booq_split_minqaar.mp3',

  './audio/letter_q_booq_split_nadeem.mp3',

  './audio/letter_q_booq_split_qadeem.mp3',

  './audio/letter_q_booq_split_saqf.mp3',

  './audio/letter_q_booq_split_yaqood.mp3',

  './audio/letter_q_booq_syl_aq.mp3',

  './audio/letter_q_booq_syl_haq.mp3',

  './audio/letter_q_booq_syl_saq.mp3',

  './audio/letter_q_booq_syl_saq2.mp3',

  './audio/letter_q_booq_vowels_station.mp3',

  './audio/letter_q_booq_word_baqar.mp3',

  './audio/letter_q_booq_word_batreeq.mp3',

  './audio/letter_q_booq_word_booq.mp3',

  './audio/letter_q_booq_word_burtuqaal.mp3',

  './audio/letter_q_booq_word_daqeeq.mp3',

  './audio/letter_q_booq_word_nadeem.mp3',

  './audio/letter_q_booq_word_nuqood.mp3',

  './audio/letter_q_booq_word_qaarib.mp3',

  './audio/letter_q_booq_word_qadeem.mp3',

  './audio/letter_q_booq_word_qalam.mp3',

  './audio/letter_q_booq_word_qareeb.mp3',

  './audio/letter_q_booq_word_qirsh.mp3',

  './audio/letter_q_booq_word_qitt.mp3',

  './audio/letter_q_booq_word_qubbaah.mp3',

  './audio/letter_q_booq_word_saqr.mp3',

  './audio/letter_q_booq_word_yaqood.mp3',

  './audio/letter_q_booq_words_intro.mp3',

  './audio/letter_q_booq_wrong.mp3',

  './audio/letter_r_analysis_intro.mp3',

  './audio/letter_r_birka_syllable.mp3',

  './audio/letter_r_draw_hint.mp3',

  './audio/letter_r_furshaat_syllable.mp3',

  './audio/letter_r_intro.mp3',

  './audio/letter_r_jazar.mp3',

  './audio/letter_r_kharoof.mp3',

  './audio/letter_r_kharoof_vowel.mp3',

  './audio/letter_r_long_a.mp3',

  './audio/letter_r_long_i.mp3',

  './audio/letter_r_long_u.mp3',

  './audio/letter_r_merge_dar.mp3',

  './audio/letter_r_merge_intro.mp3',

  './audio/letter_r_merge_rafid.mp3',

  './audio/letter_r_merge_rami.mp3',

  './audio/letter_r_mibraat.mp3',

  './audio/letter_r_mibraat_vowel.mp3',

  './audio/letter_r_model_alone.mp3',

  './audio/letter_r_model_we.mp3',

  './audio/letter_r_model_you.mp3',

  './audio/letter_r_qarib.mp3',

  './audio/letter_r_qird.mp3',

  './audio/letter_r_qird_syllable.mp3',

  './audio/letter_r_raml.mp3',

  './audio/letter_r_read_all.mp3',

  './audio/letter_r_read_baba_rami.mp3',

  './audio/letter_r_read_dada_maram.mp3',

  './audio/letter_r_read_dar_rami.mp3',

  './audio/letter_r_read_intro.mp3',

  './audio/letter_r_read_mama_reem.mp3',

  './audio/letter_r_reesha.mp3',

  './audio/letter_r_rijl.mp3',

  './audio/letter_r_saffara.mp3',

  './audio/letter_r_sareer.mp3',

  './audio/letter_r_scene_story.mp3',

  './audio/letter_r_short_a.mp3',

  './audio/letter_r_short_i.mp3',

  './audio/letter_r_short_u.mp3',

  './audio/letter_r_sound.mp3',

  './audio/letter_r_split_dar.mp3',

  './audio/letter_r_split_maram.mp3',

  './audio/letter_r_split_rama.mp3',

  './audio/letter_r_split_reem.mp3',

  './audio/letter_r_syllables_intro.mp3',

  './audio/letter_r_vowels_compare_intro.mp3',

  './audio/letter_r_vowels_intro.mp3',

  './audio/letter_r_zurr.mp3',

  './audio/letter_s_analysis_intro.mp3',

  './audio/letter_s_draw_hint.mp3',

  './audio/letter_s_fustaan.mp3',

  './audio/letter_s_fustaan_syllable.mp3',

  './audio/letter_s_hasoob.mp3',

  './audio/letter_s_intro.mp3',

  './audio/letter_s_long_a.mp3',

  './audio/letter_s_long_i.mp3',

  './audio/letter_s_long_u.mp3',

  './audio/letter_s_merge_faris.mp3',

  './audio/letter_s_merge_intro.mp3',

  './audio/letter_s_merge_mismaar.mp3',

  './audio/letter_s_merge_rasama.mp3',

  './audio/letter_s_mismaar.mp3',

  './audio/letter_s_mistarah.mp3',

  './audio/letter_s_mistarah_syllable.mp3',

  './audio/letter_s_model_alone.mp3',

  './audio/letter_s_model_we.mp3',

  './audio/letter_s_model_you.mp3',

  './audio/letter_s_nasr.mp3',

  './audio/letter_s_nasr_syllable.mp3',

  './audio/letter_s_read_all.mp3',

  './audio/letter_s_read_intro.mp3',

  './audio/letter_s_read_sentence1.mp3',

  './audio/letter_s_read_sentence2.mp3',

  './audio/letter_s_read_sentence3.mp3',

  './audio/letter_s_read_word_baba.mp3',

  './audio/letter_s_read_word_faris.mp3',

  './audio/letter_s_read_word_firas.mp3',

  './audio/letter_s_read_word_mama.mp3',

  './audio/letter_s_read_word_moosa.mp3',

  './audio/letter_s_read_word_rami.mp3',

  './audio/letter_s_read_word_rasama.mp3',

  './audio/letter_s_read_word_safara.mp3',

  './audio/letter_s_saah.mp3',

  './audio/letter_s_saah_vowel.mp3',

  './audio/letter_s_sabboora.mp3',

  './audio/letter_s_salla.mp3',

  './audio/letter_s_scene_story.mp3',

  './audio/letter_s_shams.mp3',

  './audio/letter_s_short_a.mp3',

  './audio/letter_s_short_i.mp3',

  './audio/letter_s_short_u.mp3',

  './audio/letter_s_sinjab.mp3',

  './audio/letter_s_sitara.mp3',

  './audio/letter_s_sooq.mp3',

  './audio/letter_s_sound.mp3',

  './audio/letter_s_split_darasa.mp3',

  './audio/letter_s_split_saafara.mp3',

  './audio/letter_s_split_saara.mp3',

  './audio/letter_s_sukkar.mp3',

  './audio/letter_s_sulhafah.mp3',

  './audio/letter_s_syllables_intro.mp3',

  './audio/letter_s_teacher_read_all.mp3',

  './audio/letter_s_teacher_sentence1.mp3',

  './audio/letter_s_teacher_sentence2.mp3',

  './audio/letter_s_teacher_sentence3.mp3',

  './audio/letter_s_teacher_word_baba.mp3',

  './audio/letter_s_teacher_word_faris.mp3',

  './audio/letter_s_teacher_word_mama.mp3',

  './audio/letter_s_teacher_word_moosa.mp3',

  './audio/letter_s_teacher_word_rasama.mp3',

  './audio/letter_s_teacher_word_safara.mp3',

  './audio/letter_s_timsaah.mp3',

  './audio/letter_s_timsaah_vowel.mp3',

  './audio/letter_s_vowels_compare_intro.mp3',

  './audio/letter_s_vowels_intro.mp3',

  './audio/letter_sad_analysis_intro.mp3',

  './audio/letter_sad_blend_intro.mp3',

  './audio/letter_sad_correct.mp3',

  './audio/letter_sad_draw_hint.mp3',

  './audio/letter_sad_encourage_super.mp3',

  './audio/letter_sad_intro.mp3',

  './audio/letter_sad_long_aa.mp3',

  './audio/letter_sad_long_ee.mp3',

  './audio/letter_sad_long_oo.mp3',

  './audio/letter_sad_merge_aseer.mp3',

  './audio/letter_sad_merge_saadiq.mp3',

  './audio/letter_sad_merge_saboon.mp3',

  './audio/letter_sad_merge_sidq.mp3',

  './audio/letter_sad_merge_soos.mp3',

  './audio/letter_sad_phoneme_faseeh.mp3',

  './audio/letter_sad_quiz_intro.mp3',

  './audio/letter_sad_read_b1.mp3',

  './audio/letter_sad_read_b2.mp3',

  './audio/letter_sad_read_b3.mp3',

  './audio/letter_sad_read_book_full.mp3',

  './audio/letter_sad_read_intro.mp3',

  './audio/letter_sad_read_s1.mp3',

  './audio/letter_sad_read_s2.mp3',

  './audio/letter_sad_read_s3.mp3',

  './audio/letter_sad_read_s4.mp3',

  './audio/letter_sad_read_saba_full.mp3',

  './audio/letter_sad_read_w1.mp3',

  './audio/letter_sad_read_w2.mp3',

  './audio/letter_sad_read_w3.mp3',

  './audio/letter_sad_read_w4.mp3',

  './audio/letter_sad_read_w5.mp3',

  './audio/letter_sad_read_w6.mp3',

  './audio/letter_sad_read_waqqas_full.mp3',

  './audio/letter_sad_scene_story.mp3',

  './audio/letter_sad_short_a.mp3',

  './audio/letter_sad_short_i.mp3',

  './audio/letter_sad_short_u.mp3',

  './audio/letter_sad_sound.mp3',

  './audio/letter_sad_split_aseer.mp3',

  './audio/letter_sad_split_isba.mp3',

  './audio/letter_sad_split_misbaah.mp3',

  './audio/letter_sad_split_qasr.mp3',

  './audio/letter_sad_split_saadiq.mp3',

  './audio/letter_sad_split_saarookh.mp3',

  './audio/letter_sad_split_saboon.mp3',

  './audio/letter_sad_split_soof.mp3',

  './audio/letter_sad_syl_fas.mp3',

  './audio/letter_sad_syl_is.mp3',

  './audio/letter_sad_syl_mis.mp3',

  './audio/letter_sad_syl_qas.mp3',

  './audio/letter_sad_tanween_dham.mp3',

  './audio/letter_sad_tanween_fath.mp3',

  './audio/letter_sad_tanween_kasr.mp3',

  './audio/letter_sad_vowels_station.mp3',

  './audio/letter_sad_word_aseer.mp3',

  './audio/letter_sad_word_eemaan.mp3',

  './audio/letter_sad_word_farah.mp3',

  './audio/letter_sad_word_furookh.mp3',

  './audio/letter_sad_word_isba.mp3',

  './audio/letter_sad_word_mansoor.mp3',

  './audio/letter_sad_word_miqas.mp3',

  './audio/letter_sad_word_misbaah.mp3',

  './audio/letter_sad_word_nasheeda.mp3',

  './audio/letter_sad_word_nazafah.mp3',

  './audio/letter_sad_word_qafas.mp3',

  './audio/letter_sad_word_qas.mp3',

  './audio/letter_sad_word_qasr.mp3',

  './audio/letter_sad_word_raaha.mp3',

  './audio/letter_sad_word_saaboon.mp3',

  './audio/letter_sad_word_saadiq.mp3',

  './audio/letter_sad_word_saarookh.mp3',

  './audio/letter_sad_word_saba.mp3',

  './audio/letter_sad_word_sabah.mp3',

  './audio/letter_sad_word_sadeeq.mp3',

  './audio/letter_sad_word_safirah.mp3',

  './audio/letter_sad_word_sanaa.mp3',

  './audio/letter_sad_word_saqr.mp3',

  './audio/letter_sad_word_sayyad.mp3',

  './audio/letter_sad_word_seesan.mp3',

  './audio/letter_sad_word_sidq.mp3',

  './audio/letter_sad_word_sinnarah.mp3',

  './audio/letter_sad_word_soof.mp3',

  './audio/letter_sad_word_soorah.mp3',

  './audio/letter_sad_word_soos.mp3',

  './audio/letter_sad_word_sundooq.mp3',

  './audio/letter_sad_word_tayyarah.mp3',

  './audio/letter_sad_word_waqqas.mp3',

  './audio/letter_sad_word_waraq.mp3',

  './audio/letter_sad_words_intro.mp3',

  './audio/letter_sad_wrong.mp3',

  './audio/letter_sh_analysis_intro.mp3',

  './audio/letter_sh_blend_intro.mp3',

  './audio/letter_sh_correct.mp3',

  './audio/letter_sh_draw_hint.mp3',

  './audio/letter_sh_encourage_super.mp3',

  './audio/letter_sh_intro.mp3',

  './audio/letter_sh_long_aa.mp3',

  './audio/letter_sh_long_ee.mp3',

  './audio/letter_sh_long_oo.mp3',

  './audio/letter_sh_merge_farashah.mp3',

  './audio/letter_sh_merge_nasheet.mp3',

  './audio/letter_sh_merge_shamah.mp3',

  './audio/letter_sh_merge_shamil.mp3',

  './audio/letter_sh_merge_shams.mp3',

  './audio/letter_sh_merge_shurti.mp3',

  './audio/letter_sh_phoneme_faseeh.mp3',

  './audio/letter_sh_quiz_intro.mp3',

  './audio/letter_sh_read_b1.mp3',

  './audio/letter_sh_read_b2.mp3',

  './audio/letter_sh_read_b3.mp3',

  './audio/letter_sh_read_b4.mp3',

  './audio/letter_sh_read_book_full.mp3',

  './audio/letter_sh_read_intro.mp3',

  './audio/letter_sh_read_sh1.mp3',

  './audio/letter_sh_read_sh2.mp3',

  './audio/letter_sh_read_sh3.mp3',

  './audio/letter_sh_read_sh4.mp3',

  './audio/letter_sh_read_sh5.mp3',

  './audio/letter_sh_read_shamil_full.mp3',

  './audio/letter_sh_scene_story.mp3',

  './audio/letter_sh_short_a.mp3',

  './audio/letter_sh_short_i.mp3',

  './audio/letter_sh_short_u.mp3',

  './audio/letter_sh_sound.mp3',

  './audio/letter_sh_split_minshaar.mp3',

  './audio/letter_sh_split_mishmish.mp3',

  './audio/letter_sh_split_nasheet.mp3',

  './audio/letter_sh_split_qushoor.mp3',

  './audio/letter_sh_split_shaari.mp3',

  './audio/letter_sh_split_shamil.mp3',

  './audio/letter_sh_split_shams.mp3',

  './audio/letter_sh_split_ushb.mp3',

  './audio/letter_sh_syl_min.mp3',

  './audio/letter_sh_syl_mish.mp3',

  './audio/letter_sh_syl_sham.mp3',

  './audio/letter_sh_syl_ush.mp3',

  './audio/letter_sh_tanween_dham.mp3',

  './audio/letter_sh_tanween_fath.mp3',

  './audio/letter_sh_tanween_kasr.mp3',

  './audio/letter_sh_vowels_station.mp3',

  './audio/letter_sh_word_alnaas.mp3',

  './audio/letter_sh_word_ashjaar.mp3',

  './audio/letter_sh_word_farashah.mp3',

  './audio/letter_sh_word_hadeeqah.mp3',

  './audio/letter_sh_word_hulw.mp3',

  './audio/letter_sh_word_jaysh.mp3',

  './audio/letter_sh_word_manasheer.mp3',

  './audio/letter_sh_word_minshaar.mp3',

  './audio/letter_sh_word_mishaal.mp3',

  './audio/letter_sh_word_mishmish.mp3',

  './audio/letter_sh_word_misht.mp3',

  './audio/letter_sh_word_muroor.mp3',

  './audio/letter_sh_word_mushriqah.mp3',

  './audio/letter_sh_word_naseem.mp3',

  './audio/letter_sh_word_nasheet.mp3',

  './audio/letter_sh_word_qirsh.mp3',

  './audio/letter_sh_word_qushoor.mp3',

  './audio/letter_sh_word_reesh.mp3',

  './audio/letter_sh_word_shaari.mp3',

  './audio/letter_sh_word_shamah.mp3',

  './audio/letter_sh_word_shamil.mp3',

  './audio/letter_sh_word_shams.mp3',

  './audio/letter_sh_word_sheereen.mp3',

  './audio/letter_sh_word_shibl.mp3',

  './audio/letter_sh_word_shiraa.mp3',

  './audio/letter_sh_word_shubbak.mp3',

  './audio/letter_sh_word_shurti.mp3',

  './audio/letter_sh_word_tabasheer.mp3',

  './audio/letter_sh_word_tuloo.mp3',

  './audio/letter_sh_word_uboor.mp3',

  './audio/letter_sh_word_ushb.mp3',

  './audio/letter_sh_word_ward.mp3',

  './audio/letter_sh_word_yaqif.mp3',

  './audio/letter_sh_word_yusaid.mp3',

  './audio/letter_sh_words_intro.mp3',

  './audio/letter_sh_wrong.mp3',

  './audio/letter_t_analysis_intro.mp3',

  './audio/letter_t_ankaboot.mp3',

  './audio/letter_t_banaat.mp3',

  './audio/letter_t_draw_hint.mp3',

  './audio/letter_t_iltafat.mp3',

  './audio/letter_t_iltafat_syllable.mp3',

  './audio/letter_t_intro.mp3',

  './audio/letter_t_long_a.mp3',

  './audio/letter_t_long_i.mp3',

  './audio/letter_t_long_u.mp3',

  './audio/letter_t_makhtoom.mp3',

  './audio/letter_t_makhtoom_syllable.mp3',

  './audio/letter_t_marboota_intro.mp3',

  './audio/letter_t_merge_banaat.mp3',

  './audio/letter_t_merge_intro.mp3',

  './audio/letter_t_merge_tamr.mp3',

  './audio/letter_t_merge_teen.mp3',

  './audio/letter_t_merge_tumoor.mp3',

  './audio/letter_t_model_alone.mp3',

  './audio/letter_t_model_we.mp3',

  './audio/letter_t_model_you.mp3',

  './audio/letter_t_muhtafal.mp3',

  './audio/letter_t_muhtafal_syllable.mp3',

  './audio/letter_t_read_all.mp3',

  './audio/letter_t_read_intro.mp3',

  './audio/letter_t_read_sentence1.mp3',

  './audio/letter_t_read_sentence2.mp3',

  './audio/letter_t_read_sentence3.mp3',

  './audio/letter_t_read_sentence4.mp3',

  './audio/letter_t_read_word_baba.mp3',

  './audio/letter_t_read_word_banaat.mp3',

  './audio/letter_t_read_word_bustan.mp3',

  './audio/letter_t_read_word_faatin.mp3',

  './audio/letter_t_read_word_fee.mp3',

  './audio/letter_t_read_word_mama.mp3',

  './audio/letter_t_read_word_saara.mp3',

  './audio/letter_t_read_word_saarat.mp3',

  './audio/letter_t_read_word_teen.mp3',

  './audio/letter_t_scene_story.mp3',

  './audio/letter_t_short_a.mp3',

  './audio/letter_t_short_i.mp3',

  './audio/letter_t_short_u.mp3',

  './audio/letter_t_sitt.mp3',

  './audio/letter_t_sound.mp3',

  './audio/letter_t_split_banaat.mp3',

  './audio/letter_t_split_faatin.mp3',

  './audio/letter_t_split_sirtu.mp3',

  './audio/letter_t_split_toot.mp3',

  './audio/letter_t_syllables_intro.mp3',

  './audio/letter_t_taaj.mp3',

  './audio/letter_t_taaj_vowel.mp3',

  './audio/letter_t_tamr.mp3',

  './audio/letter_t_tamr_vowel.mp3',

  './audio/letter_t_teen.mp3',

  './audio/letter_t_teen_vowel.mp3',

  './audio/letter_t_timsaah.mp3',

  './audio/letter_t_timsaah_vowel.mp3',

  './audio/letter_t_toot.mp3',

  './audio/letter_t_toot_vowel.mp3',

  './audio/letter_t_tuffaah_vowel.mp3',

  './audio/letter_t_tuffaaha.mp3',

  './audio/letter_t_vowels_compare_intro.mp3',

  './audio/letter_t_vowels_intro.mp3',

  './audio/letter_ta_analysis_intro.mp3',

  './audio/letter_ta_blend_intro.mp3',

  './audio/letter_ta_correct.mp3',

  './audio/letter_ta_draw_hint.mp3',

  './audio/letter_ta_encourage_super.mp3',

  './audio/letter_ta_intro.mp3',

  './audio/letter_ta_long_aa.mp3',

  './audio/letter_ta_long_ee.mp3',

  './audio/letter_ta_long_oo.mp3',

  './audio/letter_ta_merge_bat.mp3',

  './audio/letter_ta_merge_qitaar.mp3',

  './audio/letter_ta_merge_taalib.mp3',

  './audio/letter_ta_merge_taariq.mp3',

  './audio/letter_ta_merge_toofaan.mp3',

  './audio/letter_ta_phoneme_faseeh.mp3',

  './audio/letter_ta_quiz_intro.mp3',

  './audio/letter_ta_read_fatima_full.mp3',

  './audio/letter_ta_read_full.mp3',

  './audio/letter_ta_read_intro.mp3',

  './audio/letter_ta_read_s1.mp3',

  './audio/letter_ta_read_s2.mp3',

  './audio/letter_ta_read_s3.mp3',

  './audio/letter_ta_read_s4.mp3',

  './audio/letter_ta_read_s5.mp3',

  './audio/letter_ta_read_s6.mp3',

  './audio/letter_ta_scene_story.mp3',

  './audio/letter_ta_short_a.mp3',

  './audio/letter_ta_short_i.mp3',

  './audio/letter_ta_short_u.mp3',

  './audio/letter_ta_sound.mp3',

  './audio/letter_ta_split_bat.mp3',

  './audio/letter_ta_split_bisaat.mp3',

  './audio/letter_ta_split_qubtaan.mp3',

  './audio/letter_ta_split_tareeq.mp3',

  './audio/letter_ta_syl_bit.mp3',

  './audio/letter_ta_syl_mat.mp3',

  './audio/letter_ta_syl_mit.mp3',

  './audio/letter_ta_syllables_station.mp3',

  './audio/letter_ta_vowels_station.mp3',

  './audio/letter_ta_word_bat.mp3',

  './audio/letter_ta_word_bisaat.mp3',

  './audio/letter_ta_word_bitreeq.mp3',

  './audio/letter_ta_word_lutfi.mp3',

  './audio/letter_ta_word_matbakh.mp3',

  './audio/letter_ta_word_mitraqah.mp3',

  './audio/letter_ta_word_qitaar.mp3',

  './audio/letter_ta_word_qubtaan.mp3',

  './audio/letter_ta_word_taalib.mp3',

  './audio/letter_ta_word_taariq.mp3',

  './audio/letter_ta_word_tabeeb.mp3',

  './audio/letter_ta_word_tabl.mp3',

  './audio/letter_ta_word_teen.mp3',

  './audio/letter_ta_word_tifl.mp3',

  './audio/letter_ta_word_tuyoort.mp3',

  './audio/letter_ta_wrong.mp3',

  './audio/letter_tha_analysis_intro.mp3',

  './audio/letter_tha_blend_intro.mp3',

  './audio/letter_tha_correct.mp3',

  './audio/letter_tha_draw_hint.mp3',

  './audio/letter_tha_encourage_super.mp3',

  './audio/letter_tha_intro.mp3',

  './audio/letter_tha_long_aa.mp3',

  './audio/letter_tha_long_ee.mp3',

  './audio/letter_tha_long_oo.mp3',

  './audio/letter_tha_merge_athaath.mp3',

  './audio/letter_tha_merge_sentence.mp3',

  './audio/letter_tha_merge_theeraan.mp3',

  './audio/letter_tha_merge_thubaan.mp3',

  './audio/letter_tha_merge_timthaal.mp3',

  './audio/letter_tha_merge_turaath.mp3',

  './audio/letter_tha_phoneme_faseeh.mp3',

  './audio/letter_tha_quiz_intro.mp3',

  './audio/letter_tha_read_b1.mp3',

  './audio/letter_tha_read_b2.mp3',

  './audio/letter_tha_read_b3.mp3',

  './audio/letter_tha_read_book_full.mp3',

  './audio/letter_tha_read_h1.mp3',

  './audio/letter_tha_read_h2.mp3',

  './audio/letter_tha_read_h3.mp3',

  './audio/letter_tha_read_h4.mp3',

  './audio/letter_tha_read_h5.mp3',

  './audio/letter_tha_read_haarith_full.mp3',

  './audio/letter_tha_read_intro.mp3',

  './audio/letter_tha_scene_story.mp3',

  './audio/letter_tha_shape_first.mp3',

  './audio/letter_tha_shape_last_conn.mp3',

  './audio/letter_tha_shape_last_sep.mp3',

  './audio/letter_tha_shape_mid.mp3',

  './audio/letter_tha_shapes_intro.mp3',

  './audio/letter_tha_short_a.mp3',

  './audio/letter_tha_short_i.mp3',

  './audio/letter_tha_short_u.mp3',

  './audio/letter_tha_sound.mp3',

  './audio/letter_tha_split_athaath.mp3',

  './audio/letter_tha_split_haarith.mp3',

  './audio/letter_tha_split_layth.mp3',

  './audio/letter_tha_split_meeraath.mp3',

  './audio/letter_tha_split_thaalab.mp3',

  './audio/letter_tha_split_thimaar.mp3',

  './audio/letter_tha_split_thubaan.mp3',

  './audio/letter_tha_split_turaath.mp3',

  './audio/letter_tha_syl_ath.mp3',

  './audio/letter_tha_syl_intro.mp3',

  './audio/letter_tha_syl_ith.mp3',

  './audio/letter_tha_syl_muth.mp3',

  './audio/letter_tha_syl_thul.mp3',

  './audio/letter_tha_vowels_station.mp3',

  './audio/letter_tha_word_addajaaj.mp3',

  './audio/letter_tha_word_alard.mp3',

  './audio/letter_tha_word_alghanam.mp3',

  './audio/letter_tha_word_aljarraar.mp3',

  './audio/letter_tha_word_athaath.mp3',

  './audio/letter_tha_word_athqaal.mp3',

  './audio/letter_tha_word_baaith.mp3',

  './audio/letter_tha_word_bi-athqaal.mp3',

  './audio/letter_tha_word_fallaah.mp3',

  './audio/letter_tha_word_ghayth.mp3',

  './audio/letter_tha_word_haarith.mp3',

  './audio/letter_tha_word_ithnaan.mp3',

  './audio/letter_tha_word_kummathraa.mp3',

  './audio/letter_tha_word_kuraat.mp3',

  './audio/letter_tha_word_laiba.mp3',

  './audio/letter_tha_word_layth.mp3',

  './audio/letter_tha_word_luaban.mp3',

  './audio/letter_tha_word_meeraath.mp3',

  './audio/letter_tha_word_min_waraq.mp3',

  './audio/letter_tha_word_muthallath.mp3',

  './audio/letter_tha_word_muthmirah.mp3',

  './audio/letter_tha_word_taraa.mp3',

  './audio/letter_tha_word_tasnaoo.mp3',

  './audio/letter_tha_word_thaabit.mp3',

  './audio/letter_tha_word_thaalab.mp3',

  './audio/letter_tha_word_thalj.mp3',

  './audio/letter_tha_word_thawm.mp3',

  './audio/letter_tha_word_theeraan.mp3',

  './audio/letter_tha_word_thimaar.mp3',

  './audio/letter_tha_word_thiyaab.mp3',

  './audio/letter_tha_word_thubaan.mp3',

  './audio/letter_tha_word_thurayyaa.mp3',

  './audio/letter_tha_word_timthaal.mp3',

  './audio/letter_tha_word_turaath.mp3',

  './audio/letter_tha_word_turabbee.mp3',

  './audio/letter_tha_word_waladuhu.mp3',

  './audio/letter_tha_word_yahruthu.mp3',

  './audio/letter_tha_word_yasooqu.mp3',

  './audio/letter_tha_word_yusaaiduhu.mp3',

  './audio/letter_tha_words_intro.mp3',

  './audio/letter_tha_wrong.mp3',

  './audio/letter_z_analysis_intro.mp3',

  './audio/letter_z_blend_intro.mp3',

  './audio/letter_z_correct.mp3',

  './audio/letter_z_draw_hint.mp3',

  './audio/letter_z_encourage_super.mp3',

  './audio/letter_z_intro.mp3',

  './audio/letter_z_long_aa.mp3',

  './audio/letter_z_long_ee.mp3',

  './audio/letter_z_long_oo.mp3',

  './audio/letter_z_merge_ghazal.mp3',

  './audio/letter_z_merge_halazoon.mp3',

  './audio/letter_z_merge_mazraah.mp3',

  './audio/letter_z_merge_mizmar.mp3',

  './audio/letter_z_merge_zaynab.mp3',

  './audio/letter_z_merge_zaytoon.mp3',

  './audio/letter_z_phoneme_faseeh.mp3',

  './audio/letter_z_quiz_intro.mp3',

  './audio/letter_z_read_b1.mp3',

  './audio/letter_z_read_b2.mp3',

  './audio/letter_z_read_book_full.mp3',

  './audio/letter_z_read_intro.mp3',

  './audio/letter_z_read_q1.mp3',

  './audio/letter_z_read_q2.mp3',

  './audio/letter_z_read_q3.mp3',

  './audio/letter_z_read_q4.mp3',

  './audio/letter_z_read_q5.mp3',

  './audio/letter_z_read_q6.mp3',

  './audio/letter_z_read_qaddoori_full.mp3',

  './audio/letter_z_read_w1.mp3',

  './audio/letter_z_read_w2.mp3',

  './audio/letter_z_read_w3.mp3',

  './audio/letter_z_read_w4.mp3',

  './audio/letter_z_read_w5.mp3',

  './audio/letter_z_read_w6.mp3',

  './audio/letter_z_read_wazz_full.mp3',

  './audio/letter_z_scene_story.mp3',

  './audio/letter_z_short_a.mp3',

  './audio/letter_z_short_i.mp3',

  './audio/letter_z_short_u.mp3',

  './audio/letter_z_sound.mp3',

  './audio/letter_z_split_azhaar.mp3',

  './audio/letter_z_split_ghazal.mp3',

  './audio/letter_z_split_halazoon.mp3',

  './audio/letter_z_split_mazraah.mp3',

  './audio/letter_z_split_mizmar.mp3',

  './audio/letter_z_split_zawraq.mp3',

  './audio/letter_z_split_zaytoon.mp3',

  './audio/letter_z_syl_az.mp3',

  './audio/letter_z_syl_maz.mp3',

  './audio/letter_z_syl_miz.mp3',

  './audio/letter_z_syl_zay.mp3',

  './audio/letter_z_tanween_dham.mp3',

  './audio/letter_z_tanween_fath.mp3',

  './audio/letter_z_tanween_kasr.mp3',

  './audio/letter_z_vowels_station.mp3',

  './audio/letter_z_word_azhaar.mp3',

  './audio/letter_z_word_babana.mp3',

  './audio/letter_z_word_bazzaz.mp3',

  './audio/letter_z_word_dada.mp3',

  './audio/letter_z_word_daqqa.mp3',

  './audio/letter_z_word_dar.mp3',

  './audio/letter_z_word_darbina.mp3',

  './audio/letter_z_word_ghazal.mp3',

  './audio/letter_z_word_halazoon.mp3',

  './audio/letter_z_word_haleeb.mp3',

  './audio/letter_z_word_hizam.mp3',

  './audio/letter_z_word_jazeerah.mp3',

  './audio/letter_z_word_marra.mp3',

  './audio/letter_z_word_mawz.mp3',

  './audio/letter_z_word_mazin.mp3',

  './audio/letter_z_word_mazraah.mp3',

  './audio/letter_z_word_mizan.mp3',

  './audio/letter_z_word_mizhariyyah.mp3',

  './audio/letter_z_word_mizmar.mp3',

  './audio/letter_z_word_nadir.mp3',

  './audio/letter_z_word_nameer.mp3',

  './audio/letter_z_word_nashtari.mp3',

  './audio/letter_z_word_nazoor.mp3',

  './audio/letter_z_word_qaddoori.mp3',

  './audio/letter_z_word_qareeb.mp3',

  './audio/letter_z_word_rabab.mp3',

  './audio/letter_z_word_rabba.mp3',

  './audio/letter_z_word_ruzz.mp3',

  './audio/letter_z_word_wazana.mp3',

  './audio/letter_z_word_wazz.mp3',

  './audio/letter_z_word_wazzan.mp3',

  './audio/letter_z_word_zabeeb.mp3',

  './audio/letter_z_word_zahrah.mp3',

  './audio/letter_z_word_zawraq.mp3',

  './audio/letter_z_word_zayd.mp3',

  './audio/letter_z_word_zaydoon.mp3',

  './audio/letter_z_word_zaynab.mp3',

  './audio/letter_z_word_zaytoon.mp3',

  './audio/letter_z_word_zeenah.mp3',

  './audio/letter_z_word_zirr.mp3',

  './audio/letter_z_word_zubd.mp3',

  './audio/letter_z_word_zujajah.mp3',

  './audio/letter_z_word_zurna.mp3',

  './audio/letter_z_words_intro.mp3',

  './audio/letter_z_wrong.mp3',

  './audio/mascot_hint.mp3',

  './audio/mascot_welcome.mp3',

  './audio/nasheed_batta.mp3',

  './audio/phonics_a.mp3',

  './audio/phonics_maqsura.mp3',

  './audio/quiz_prompt.mp3',

  './audio/reset.mp3',

  './audio/shaddah_act1_intro.mp3',

  './audio/shaddah_act2_intro.mp3',

  './audio/shaddah_act3_intro.mp3',

  './audio/shaddah_act4_intro.mp3',

  './audio/shaddah_act5_intro.mp3',

  './audio/shaddah_act8_intro.mp3',

  './audio/shaddah_correct.mp3',

  './audio/shaddah_dhamma.mp3',

  './audio/shaddah_draw_hint.mp3',

  './audio/shaddah_draw_najjaar.mp3',

  './audio/shaddah_draw_sabboorah.mp3',

  './audio/shaddah_draw_tayyaarah.mp3',

  './audio/shaddah_draw_tumashshitu.mp3',

  './audio/shaddah_encourage_super.mp3',

  './audio/shaddah_fatha.mp3',

  './audio/shaddah_form_bitteekh.mp3',

  './audio/shaddah_form_dabboos.mp3',

  './audio/shaddah_form_qittah.mp3',

  './audio/shaddah_intro.mp3',

  './audio/shaddah_kasra.mp3',

  './audio/shaddah_merge_najjaar.mp3',

  './audio/shaddah_merge_tuffaah.mp3',

  './audio/shaddah_merge_yuhibbu.mp3',

  './audio/shaddah_nasheed_b1.mp3',

  './audio/shaddah_nasheed_b2.mp3',

  './audio/shaddah_nasheed_b3.mp3',

  './audio/shaddah_nasheed_b4.mp3',

  './audio/shaddah_nasheed_full.mp3',

  './audio/shaddah_nasheed_intro.mp3',

  './audio/shaddah_phoneme_faseeh.mp3',

  './audio/shaddah_quiz_intro.mp3',

  './audio/shaddah_read_intro.mp3',

  './audio/shaddah_read_jaddi_full.mp3',

  './audio/shaddah_read_qaddoori.mp3',

  './audio/shaddah_read_s1.mp3',

  './audio/shaddah_read_s2.mp3',

  './audio/shaddah_read_s3.mp3',

  './audio/shaddah_read_s4.mp3',

  './audio/shaddah_read_waqqas.mp3',

  './audio/shaddah_scene_story.mp3',

  './audio/shaddah_sound.mp3',

  './audio/shaddah_split_barraad.mp3',

  './audio/shaddah_split_muallim.mp3',

  './audio/shaddah_split_yaqussu.mp3',

  './audio/shaddah_word_ahdarat.mp3',

  './audio/shaddah_word_aliyy.mp3',

  './audio/shaddah_word_barraad.mp3',

  './audio/shaddah_word_bayta.mp3',

  './audio/shaddah_word_bitteekh.mp3',

  './audio/shaddah_word_dabboos.mp3',

  './audio/shaddah_word_dubb.mp3',

  './audio/shaddah_word_jadd.mp3',

  './audio/shaddah_word_jaddati.mp3',

  './audio/shaddah_word_jaddi.mp3',

  './audio/shaddah_word_maa.mp3',

  './audio/shaddah_word_miqass.mp3',

  './audio/shaddah_word_muallim.mp3',

  './audio/shaddah_word_muharrij.mp3',

  './audio/shaddah_word_muka-abaat.mp3',

  './audio/shaddah_word_mulawwanah.mp3',

  './audio/shaddah_word_muthallath.mp3',

  './audio/shaddah_word_najjaar.mp3',

  './audio/shaddah_word_qittah.mp3',

  './audio/shaddah_word_rakkaptu.mp3',

  './audio/shaddah_word_sabboorah.mp3',

  './audio/shaddah_word_sayyaarah.mp3',

  './audio/shaddah_word_sayyaaratan.mp3',

  './audio/shaddah_word_tayyaarah.mp3',

  './audio/shaddah_word_tuffaah.mp3',

  './audio/shaddah_word_tumashshitu.mp3',

  './audio/shaddah_word_wa-jaddati.mp3',

  './audio/shaddah_word_wa-rakkappa.mp3',

  './audio/shaddah_word_yaqussu.mp3',

  './audio/shaddah_word_yuhibbu.mp3',

  './audio/shaddah_word_zurna.mp3',

  './audio/shaddah_wrong.mp3',

  './audio/short_giraffe_wrong.mp3',

  './audio/short_pencil_wrong.mp3',

  './audio/syllable_da.mp3',

  './audio/tall_giraffe_correct.mp3',

  './audio/tall_pencil_correct.mp3',

  './audio/tanween_dham_act2_intro.mp3',

  './audio/tanween_dham_analysis_intro.mp3',

  './audio/tanween_dham_bab.mp3',

  './audio/tanween_dham_blend_intro.mp3',

  './audio/tanween_dham_compare_intro.mp3',

  './audio/tanween_dham_correct.mp3',

  './audio/tanween_dham_draw_hint.mp3',

  './audio/tanween_dham_faris.mp3',

  './audio/tanween_dham_haqeebah.mp3',

  './audio/tanween_dham_intro.mp3',

  './audio/tanween_dham_kitab.mp3',

  './audio/tanween_dham_lahm.mp3',

  './audio/tanween_dham_lawh.mp3',

  './audio/tanween_dham_merge_tamr.mp3',

  './audio/tanween_dham_merge_teen.mp3',

  './audio/tanween_dham_merge_toot.mp3',

  './audio/tanween_dham_merge_ward.mp3',

  './audio/tanween_dham_model_alone.mp3',

  './audio/tanween_dham_model_we.mp3',

  './audio/tanween_dham_model_you.mp3',

  './audio/tanween_dham_mudeerah.mp3',

  './audio/tanween_dham_pair_ba.mp3',

  './audio/tanween_dham_pair_da.mp3',

  './audio/tanween_dham_pair_na.mp3',

  './audio/tanween_dham_pair_ra.mp3',

  './audio/tanween_dham_pair_ta.mp3',

  './audio/tanween_dham_pair_ward.mp3',

  './audio/tanween_dham_qird.mp3',

  './audio/tanween_dham_quiz_intro.mp3',

  './audio/tanween_dham_read_all.mp3',

  './audio/tanween_dham_read_intro.mp3',

  './audio/tanween_dham_read_s1.mp3',

  './audio/tanween_dham_read_s2.mp3',

  './audio/tanween_dham_read_s3.mp3',

  './audio/tanween_dham_read_s4_ward.mp3',

  './audio/tanween_dham_reading_station.mp3',

  './audio/tanween_dham_rule_summary.mp3',

  './audio/tanween_dham_scene_story.mp3',

  './audio/tanween_dham_sound.mp3',

  './audio/tanween_dham_split_sirb.mp3',

  './audio/tanween_dham_split_soor.mp3',

  './audio/tanween_dham_split_ward.mp3',

  './audio/tanween_dham_syllables_station.mp3',

  './audio/tanween_dham_vowels_station.mp3',

  './audio/tanween_dham_word_bustaani.mp3',

  './audio/tanween_dham_word_faatina.mp3',

  './audio/tanween_dham_word_fee.mp3',

  './audio/tanween_dham_word_jameelun.mp3',

  './audio/tanween_dham_word_lateefun.mp3',

  './audio/tanween_dham_word_madrasati.mp3',

  './audio/tanween_dham_word_mateen.mp3',

  './audio/tanween_dham_word_sooru.mp3',

  './audio/tanween_dham_word_tootun.mp3',

  './audio/tanween_dham_word_wardun.mp3',

  './audio/tanween_dham_word_watamrun.mp3',

  './audio/tanween_dham_word_wateenun.mp3',

  './audio/tanween_dham_wrong.mp3',

  './audio/tanween_kasr_intro.mp3',

  './audio/tanween_kasr_sentence_malab.mp3',

  './audio/tanween_kasr_sentence_qitaar.mp3',

  './audio/tanween_kasr_sentence_wisadah.mp3',

  './audio/tanween_kasr_split_malab.mp3',

  './audio/tanween_kasr_split_naimah.mp3',

  './audio/tanween_kasr_split_qitaar.mp3',

  './audio/tanween_kasr_split_saree.mp3',

  './audio/tanween_kasr_split_wasee.mp3',

  './audio/tanween_kasr_split_wisadah.mp3',

  './audio/tanween_kasr_word_banaat.mp3',

  './audio/tanween_kasr_word_hoot.mp3',

  './audio/tanween_kasr_word_mawz.mp3',

  './audio/tanween_kasr_word_zaytoon.mp3',

  './audio/teach_giraffe.mp3',

  './audio/teach_intro.mp3',

  './audio/teach_pencil.mp3',

  './audio/teacher_act5_alif_sound.mp3',

  './audio/teacher_act5_all.mp3',

  './audio/teacher_act5_asa.mp3',

  './audio/teacher_act5_dar.mp3',

  './audio/teacher_act5_ghazal.mp3',

  './audio/teacher_act5_halwa.mp3',

  './audio/teacher_act5_intro.mp3',

  './audio/teacher_act5_mrma.mp3',

  './audio/teacher_letter_d_act1_intro.mp3',

  './audio/teacher_letter_d_asad.mp3',

  './audio/teacher_letter_d_dalla.mp3',

  './audio/teacher_letter_d_dar.mp3',

  './audio/teacher_letter_d_deek.mp3',

  './audio/teacher_letter_d_dirham.mp3',

  './audio/teacher_letter_d_dood.mp3',

  './audio/teacher_letter_d_dub.mp3',

  './audio/teacher_letter_d_qidr.mp3',

  './audio/teacher_letter_d_words_all.mp3',

  './audio/teacher_letter_f_act1_intro.mp3',

  './audio/teacher_letter_f_act7_intro.mp3',

  './audio/teacher_letter_f_fanous.mp3',

  './audio/teacher_letter_f_farasha.mp3',

  './audio/teacher_letter_f_feel.mp3',

  './audio/teacher_letter_f_finjan.mp3',

  './audio/teacher_letter_f_fustan.mp3',

  './audio/teacher_letter_f_miftah.mp3',

  './audio/teacher_letter_f_mitaf.mp3',

  './audio/teacher_letter_f_nafoora.mp3',

  './audio/teacher_letter_f_read_all.mp3',

  './audio/teacher_letter_f_read_fadi.mp3',

  './audio/teacher_letter_f_read_fam.mp3',

  './audio/teacher_letter_f_read_mufeed.mp3',

  './audio/teacher_letter_f_split_dufoof.mp3',

  './audio/teacher_letter_f_words_all.mp3',

  './audio/teacher_letter_m_act1_intro.mp3',

  './audio/teacher_letter_m_laymun.mp3',

  './audio/teacher_letter_m_mawz.mp3',

  './audio/teacher_letter_m_miftah.mp3',

  './audio/teacher_letter_m_mizan.mp3',

  './audio/teacher_letter_m_mizmar.mp3',

  './audio/teacher_letter_m_murabba.mp3',

  './audio/teacher_letter_m_qamh.mp3',

  './audio/teacher_letter_m_thawm.mp3',

  './audio/teacher_letter_m_words_all.mp3',

  './audio/teacher_reading_act7_a_intro.mp3',

  './audio/teacher_reading_act7_b_intro.mp3',

  './audio/teacher_reading_baba.mp3',

  './audio/teacher_reading_baba_b.mp3',

  './audio/teacher_reading_baba_mama_boom.mp3',

  './audio/teacher_reading_baba_mama_dada.mp3',

  './audio/teacher_reading_boom.mp3',

  './audio/teacher_reading_dada.mp3',

  './audio/teacher_reading_mama.mp3',

  './audio/teacher_reading_mama_b.mp3',

  './audio/teacher_vowel_w_all.mp3',

  './audio/teacher_vowel_w_buma.mp3',

  './audio/teacher_vowel_w_intro.mp3',

  './audio/teacher_vowel_w_kharuf.mp3',

  './audio/teacher_vowel_w_soos.mp3',

  './audio/teacher_vowel_w_tawoos.mp3',

  './audio/teacher_vowel_w_usfoor.mp3',

  './audio/teacher_vowel_y_all.mp3',

  './audio/teacher_vowel_y_bisat.mp3',

  './audio/teacher_vowel_y_dik.mp3',

  './audio/teacher_vowel_y_halib.mp3',

  './audio/teacher_vowel_y_intro.mp3',

  './audio/teacher_vowel_y_rish.mp3',

  './audio/unit1_fatiha_ayah1.mp3',

  './audio/unit1_fatiha_ayah2.mp3',

  './audio/unit1_fatiha_ayah3.mp3',

  './audio/unit1_fatiha_ayah4.mp3',

  './audio/unit1_fatiha_ayah5.mp3',

  './audio/unit1_fatiha_ayah6.mp3',

  './audio/unit1_fatiha_ayah7.mp3',

  './audio/unit1_fatiha_full.mp3',

  './audio/unit1_fatiha_intro.mp3',

  './audio/unit1_fatiha_repeat_prompt.mp3',

  './audio/unit1_fatiha_sadaqa.mp3',

  './audio/unit1_grad_cheer.mp3',

  './audio/unit1_grad_intro.mp3',

  './audio/unit1_harvest_intro.mp3',

  './audio/unit1_listen_story.mp3',

  './audio/unit1_nasheed_full.mp3',

  './audio/unit1_nasheed_intro.mp3',

  './audio/unit1_nasheed_verse1.mp3',

  './audio/unit1_nasheed_verse2.mp3',

  './audio/unit1_nasheed_verse3.mp3',

  './audio/unit1_nasheed_verse4.mp3',

  './audio/unit1_nasheed_verse5.mp3',

  './audio/unit1_nasheed_verse6.mp3',

  './audio/unit1_nasheed_word_emad.mp3',

  './audio/unit1_nasheed_word_farha.mp3',

  './audio/unit1_nasheed_word_moallimati.mp3',

  './audio/unit1_nasheed_word_nabd.mp3',

  './audio/unit1_q1_desc.mp3',

  './audio/unit1_q2_story.mp3',

  './audio/unit1_q3_deal.mp3',

  './audio/unit1_quran_welcome.mp3',

  './audio/unit1_review_all_words.mp3',

  './audio/unit1_review_b.mp3',

  './audio/unit1_review_d.mp3',

  './audio/unit1_review_f.mp3',

  './audio/unit1_review_m.mp3',

  './audio/unit1_story_grandma.mp3',

  './audio/unit1_story_kitchen.mp3',

  './audio/unit1_story_living.mp3',

  './audio/unit1_welcome.mp3',

  './audio/unit2_facility_building.mp3',

  './audio/unit2_facility_pupils.mp3',

  './audio/unit2_facility_teacher.mp3',

  './audio/unit2_facility_yard.mp3',

  './audio/unit2_grad_cheer.mp3',

  './audio/unit2_grad_intro.mp3',

  './audio/unit2_harvest_intro.mp3',

  './audio/unit2_merge_tamr.mp3',

  './audio/unit2_merge_teen.mp3',

  './audio/unit2_merge_toot.mp3',

  './audio/unit2_nasheed_full.mp3',

  './audio/unit2_nasheed_intro.mp3',

  './audio/unit2_nasheed_verse1.mp3',

  './audio/unit2_nasheed_verse2.mp3',

  './audio/unit2_nasheed_verse3.mp3',

  './audio/unit2_nasheed_verse4.mp3',

  './audio/unit2_nasheed_word_ekhwati.mp3',

  './audio/unit2_nasheed_word_farhati.mp3',

  './audio/unit2_nasheed_word_izzati.mp3',

  './audio/unit2_nasheed_word_madrasati.mp3',

  './audio/unit2_nasheed_word_rahati.mp3',

  './audio/unit2_q1_desc.mp3',

  './audio/unit2_q2_yard.mp3',

  './audio/unit2_q3_classroom.mp3',

  './audio/unit2_q4_advice.mp3',

  './audio/unit2_q5_story.mp3',

  './audio/unit2_quiz_correct.mp3',

  './audio/unit2_quiz_finish.mp3',

  './audio/unit2_quiz_intro.mp3',

  './audio/unit2_quiz_q1.mp3',

  './audio/unit2_quiz_q2.mp3',

  './audio/unit2_quiz_q3.mp3',

  './audio/unit2_quiz_wrong.mp3',

  './audio/unit2_reading_all_sentences.mp3',

  './audio/unit2_reading_fatin.mp3',

  './audio/unit2_reading_intro.mp3',

  './audio/unit2_reading_soor.mp3',

  './audio/unit2_reading_teen_tamr.mp3',

  './audio/unit2_review_all_words.mp3',

  './audio/unit2_review_marboota.mp3',

  './audio/unit2_review_n.mp3',

  './audio/unit2_review_r.mp3',

  './audio/unit2_review_s.mp3',

  './audio/unit2_review_t.mp3',

  './audio/unit2_review_tanween.mp3',

  './audio/unit2_school_story_full.mp3',

  './audio/unit2_split_bustan.mp3',

  './audio/unit2_split_madrasati.mp3',

  './audio/unit2_split_mateen.mp3',

  './audio/unit2_story_scene_classroom.mp3',

  './audio/unit2_story_scene_friends.mp3',

  './audio/unit2_story_scene_yard.mp3',

  './audio/unit2_welcome.mp3',

  './audio/unit2_welcome_bassel.mp3',

  './audio/unit3_intro_story_full.mp3',

  './audio/unit3_intro_welcome.mp3',

  './audio/unit3_talk_animals.mp3',

  './audio/unit3_talk_questions.mp3',

  './audio/unit3_talk_toys.mp3',

  './audio/unit4_intro_story_full.mp3',

  './audio/unit4_intro_welcome.mp3',

  './audio/unit4_talk_clean.mp3',

  './audio/unit4_talk_food.mp3',

  './audio/unit4_talk_health.mp3',

  './audio/unit5_hobbies_story.mp3',

  './audio/voice_confirm_bassel.mp3',

  './audio/voice_confirm_integrated.mp3',

  './audio/voice_confirm_rana.mp3',

  './audio/voice_preview_bassel.mp3',

  './audio/voice_preview_rana.mp3',

  './audio/vowel_w_buma.mp3',

  './audio/vowel_w_bunduq.mp3',

  './audio/vowel_w_buq.mp3',

  './audio/vowel_w_draw_hint.mp3',

  './audio/vowel_w_dumya.mp3',

  './audio/vowel_w_fill_intro.mp3',

  './audio/vowel_w_fill_kharuf.mp3',

  './audio/vowel_w_fill_laymun.mp3',

  './audio/vowel_w_fill_nusur.mp3',

  './audio/vowel_w_fill_suf.mp3',

  './audio/vowel_w_hasub.mp3',

  './audio/vowel_w_intro.mp3',

  './audio/vowel_w_kharuf.mp3',

  './audio/vowel_w_nujum.mp3',

  './audio/vowel_w_quiz_intro.mp3',

  './audio/vowel_w_sound.mp3',

  './audio/vowel_w_tut.mp3',

  './audio/vowel_y_bisat.mp3',

  './audio/vowel_y_dik.mp3',

  './audio/vowel_y_draw_hint.mp3',

  './audio/vowel_y_fil.mp3',

  './audio/vowel_y_fill_bittikh.mp3',

  './audio/vowel_y_fill_fil.mp3',

  './audio/vowel_y_fill_intro.mp3',

  './audio/vowel_y_fill_rish.mp3',

  './audio/vowel_y_fill_safina.mp3',

  './audio/vowel_y_halib.mp3',

  './audio/vowel_y_intro.mp3',

  './audio/vowel_y_mizan.mp3',

  './audio/vowel_y_quiz_intro.mp3',

  './audio/vowel_y_rish.mp3',

  './audio/vowel_y_siwar.mp3',

  './audio/vowel_y_sound.mp3',

  './audio/vowel_y_tin.mp3',

  './audio/word_dada.mp3'

];



self.addEventListener('install', (event) => {

  event.waitUntil(

    caches.open(CACHE_NAME).then((cache) => {

      console.log('PWA Service Worker: Caching all assets for offline use');

      return cache.addAll(ASSETS_TO_CACHE);

    })

  );

  self.skipWaiting();

});



self.addEventListener('activate', (event) => {

  event.waitUntil(

    caches.keys().then((keys) => {

      return Promise.all(

        keys.map((key) => {

          // المخازن مشتركة بين كل تطبيقات usama-kh75.github.io: يُحذف القديم من مخازن هذا التطبيق وحده

          if (key.startsWith('qiraati-smart-') && key !== CACHE_NAME) {

            console.log('PWA Service Worker: Clearing old cache', key);

            return caches.delete(key);

          }

        })

      );

    })

  );

  self.clients.claim();

});



self.addEventListener('fetch', (event) => {
  // للروابط ومستند HTML الرئيسي: محاولة الجلب من الشبكة أولاً للتحديث الفوري، مع الرجوع للمخزن عند انقطاع الإنترنت
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match('./index.html', { cacheName: CACHE_NAME });
      })
    );
    return;
  }

  // لبقية الأصول المخزنة (أصوات، صور، خطوط): القراءة من مخزن التطبيق بالاسم حصراً
  event.respondWith(
    caches.match(event.request, { cacheName: CACHE_NAME }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

