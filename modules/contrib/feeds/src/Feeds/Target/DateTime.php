<?php

namespace Drupal\feeds\Feeds\Target;

/**
 * Defines a datetime field mapper.
 *
 * @FeedsTarget(
 *   id = "datetime",
 *   field_types = {"datetime"}
 * )
 */
class DateTime extends DateTargetBase {

  /**
   * The datetime storage format.
   *
   * @var string
   */
  protected $storageFormat;

  /**
   * {@inheritdoc}
   */
  public function __construct(array $configuration, $plugin_id, array $plugin_definition) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->storageFormat = $this->settings['datetime_type'] === 'date' ? DATETIME_DATE_STORAGE_FORMAT : DATETIME_DATETIME_STORAGE_FORMAT;
  }

  /**
   * {@inheritdoc}
   */
  protected function prepareValue($delta, array &$values) {
    $values['value'] = $this->prepareDateValue($values['value']);
  }

  /**
   * Prepares a date value.
   *
   * @param string $value
   *   The value to convert to a date.
   *
   * @return string
   *   A formatted date, in UTC time.
   */
  protected function prepareDateValue($value) {
    /** @var \Drupal\Core\Datetime\DrupalDateTime|null */
    $date = $this->convertToDate($value);

    if (isset($date) && !$date->hasErrors()) {
      return $date->format($this->storageFormat, [
        'timezone' => DATETIME_STORAGE_TIMEZONE,
      ]);
    }
    return '';
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return ['timezone' => DATETIME_STORAGE_TIMEZONE];
  }

}
