$(document).ready(function() {

    // Add to cart form

    let addToCartFormSelector = '#add-to-cart-form',
        productOptionSelector = addToCartFormSelector + ' [name*=option]';

    let productForm = {
        onProductOptionChanged: function(event) {
            let
                $form = $(this).closest(addToCartFormSelector),
                selectedVariant = productForm.getActiveVariant($form);

            $form.trigger('form:change', [selectedVariant]);

            console.log(selectedVariant);
        },
        getActiveVariant: function($form) {
            let
                variants = JSON.parse(decodeURIComponent($form.attr('data-variants'))),
                formData = $form.serializeArray(),
                selectedVariant = null,
                formOptions = {
                    option1: null,
                    option2: null,
                    option3: null,
                };

            $.each(formData, function(index, item) {
                if (item.name.indexOf('option') !== -1) {
                    formOptions[item.name] = item.value;
                }
            });

            $.each(variants, function(index, variant) {
                if (variant.option1 === formOptions.option1 && variant.option2 === formOptions.option2 && variant.option3 === formOptions.option3) {
                    selectedVariant = variant;
                    return false;
                }
            });

            return selectedVariant;


        },
        validate: function(event, selectedVariant) {
            let $form = $(this),
                hasVariant = selectedVariant !== null,
                canAddToCart = hasVariant && selectedVariant.inventory_quantity > 0,
                $id = $form.find('.js-variant-id'),
                $addToCartButton = $form.find('#AddToCartButton'),
                $price = $('.js-price'),
                $discountFromPrice = $('.js-discounted-price'),
                formattedVariantPrice,
                formattedDiscountFromPrice,
                discountFromPriceHtml,
                priceHtml;


            if (hasVariant) {
                formattedVariantPrice = '€' + (selectedVariant.price / 100).toFixed(2);
                formattedDiscountFromPrice = '€' + (selectedVariant.compare_at_price / 100).toFixed(2);
                priceHtml = '<span class="money">' + formattedVariantPrice + '</span>';
              	discountFromPriceHtml = '<span class="money">' + formattedDiscountFromPrice + '</span>';
                console.log(priceHtml);
              console.log(discountFromPriceHtml);
            } else {
                priceHtml = $price.attr('data-default-price');
              	discountFromPriceHtml = $discountFromPrice.attr('data-default-price');
            }

            if (canAddToCart) {
                $id.val(selectedVariant.id);
                $addToCartButton.prop('disabled', false)
            } else {
                $id.val('');
                $addToCartButton.prop('disabled', true)
            }


            $price.html(priceHtml);
          $discountFromPrice.html(discountFromPriceHtml);
        },
        init: function() {
            $(document).on('change', productOptionSelector, productForm.onProductOptionChanged);
            $(document).on('form:change', addToCartFormSelector, productForm.validate);
        }
    };


    productForm.init();

  
});
