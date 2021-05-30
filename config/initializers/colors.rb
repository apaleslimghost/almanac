class Color::RGB
   def get_foreground(light = RGB.by_name('white'), dark = RGB.by_name('black'))
      [light, dark].max_by { _1.contrast(self) }
   end

   def contrast(other)
      other = coerce(other)

      # The following numbers have been set with some care.
      ((diff_brightness(other) * 0.65) +
       (diff_hue(other)        * 0.20) +
       (diff_luminosity(other) * 0.15))
    end

    private
    # Provides the luminosity difference between two rbg vals
    def diff_luminosity(other)
      other = coerce(other)
      l1 = (0.2126 * (other.r) ** 2.2) +
           (0.7152 * (other.b) ** 2.2) +
           (0.0722 * (other.g) ** 2.2);

      l2 = (0.2126 * (self.r) ** 2.2) +
           (0.7152 * (self.b) ** 2.2) +
           (0.0722 * (self.g) ** 2.2);

      ((([l1, l2].max) + 0.05) / ( ([l1, l2].min) + 0.05 ) - 1) / 20.0
    end

    # Provides the brightness difference.
    def diff_brightness(other)
      other = other.to_rgb
      br1 = (299 * other.r + 587 * other.g + 114 * other.b)
      br2 = (299 * self.r + 587 * self.g + 114 * self.b)
      (br1 - br2).abs / 1000.0;
    end

    # Provides the euclidean distance between the two color values
    def diff_euclidean(other)
      other = other.to_rgb
      ((((other.r - self.r) ** 2) +
        ((other.g - self.g) ** 2) +
        ((other.b - self.b) ** 2)) ** 0.5) / 1.7320508075688772
    end

    # Difference in the two colors' hue
    def diff_hue(other)
      other = other.to_rgb
      ((self.r - other.r).abs +
       (self.g - other.g).abs +
       (self.b - other.b).abs) / 3
    end
end
